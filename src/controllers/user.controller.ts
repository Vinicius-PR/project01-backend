import { PrismaClient } from '@prisma/client'
import { Request, Response } from'express'

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
import crypto from 'crypto'
import sharp from 'sharp'

dotenv.config()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION as string
const accessKey = process.env.ACCESS_KEY as string
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
})

const userClient = new PrismaClient().user

function generateRandomImageName(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

// getAllUsers

export async function getAllUsers(req:Request, res: Response) {
  try {
    const allUsers = await userClient.findMany()
    res.status(200).json({data: allUsers})
  } catch (error) {
    console.error('Error getting all users: ', error)
  }
}

// getUserById

export async function getUserById(req:Request, res: Response) {
  try {
    const userId = Number(req.params.id)
    const user = await userClient.findUnique({
      where: {
        id: userId
      }
    })

    res.status(200).json({data: user})
  } catch (error) {
    console.error('Error getting a user: ', error)
  }
}

// createUser

export async function createUser(req:Request, res: Response) {
  
  try {
    const imageName = generateRandomImageName()

    // To make sure that email is all lower case
    req.body.email = req.body.email.toLowerCase()

    // Setting properties to the body
    req.body.imageUserName = imageName
    req.body.imageUserUrl = ''

    // Saving the user into Railway database using prisma
    const user = await userClient.create({
      data: req.body
    })
    
    // Sending status 201 (created) and the user info
    res.status(201).json({data: user})
  } catch (error) {
    console.error('Error creating the user: ', error)
  }
}

// updateUser

export async function updateUser(req:Request, res: Response) {
  try {
    // To make sure that email is all lower case
    req.body.email = req.body.email.toLowerCase()

    const userId = Number(req.params.id)
    const userData = req.body

    // Update the user info inside the Railway database
    const user = await userClient.update({
      where: {
        id: userId
      },
      data: userData
    })

    res.status(200).json({data: user})

  } catch (error) {
    console.error('Error updating the user: ', error)
  }
}

// Update the Image of the User

export async function updateUserImage(req:Request, res: Response) {
  try {
    req.body.imageUserName = req.file?.originalname
    req.body.imageUserUrl = `https://project01-vini.s3.us-east-2.amazonaws.com/${req.body.imageUserName}`
    const userId = Number(req.params.id)
    const userData = req.body

    // Update the user info inside the Railway database
    const user = await userClient.update({
      where: {
        id: userId
      },
      data: userData
    })

    // Resize the image
    const buffer = await sharp(req.file?.buffer).resize({
      height: 500,
      width: 500,
      position: 'top',
      fit: 'cover'
    }).toBuffer()

    // Set params and run send command to save the image inside s3 buket AWS. The name must be equal to update the actual image
    const params = {
      Bucket: bucketName,
      Key: userData.imageUserName,
      Body: buffer,
      ContentType: req.file?.mimetype
    }
    const command = new PutObjectCommand(params)
    await s3.send(command)

    res.status(200).json({data: {}})
  } catch (error) {
    console.error('Error updating the Image user: ', error)
  }
}

// DeleteUser

export async function deleteUser(req:Request, res: Response) {
  try {
    const userId = Number(req.params.id)
    const user = await userClient.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      res.send(404).send('User not found')
    }

    // Deleting from the Railway database
    await userClient.delete({
      where: {
        id: userId
      }
    })

    const params = {
      Bucket: bucketName,
      Key: user?.imageUserName
    }

    // Deleting image from s3 bucket
    const command = new DeleteObjectCommand(params)
    await s3.send(command)

    res.status(200).json({data: {}})

  } catch (error) {
    console.error('Error deleting the user: ', error)
  }
}