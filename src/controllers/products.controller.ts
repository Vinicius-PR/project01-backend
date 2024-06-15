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

const productClient = new PrismaClient().product

function generateRandomImageName(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

// getAllProducts

export async function getAllProducts(req:Request, res: Response) {
  try {
    const allProducts = await productClient.findMany()
    res.status(200).json({data: allProducts})

  } catch (error) {
    console.error('Error getting all products: ', error)
  }
}

// getProductById

export async function getProductById(req:Request, res: Response) {
  try {
    const productId = Number(req.params.id)
    const product = await productClient.findUnique({
      where: {
        id: productId
      }
    })

    res.status(200).json({data: product})

  } catch (error) {
    console.error('Error getting a product: ', error)
  }
}

// createProduct

export async function createProduct(req:Request, res: Response) {
  try {
    // Resize the image
     const buffer = await sharp(req.file?.buffer).resize({
      height: 800,
      width: 800,
      position: 'center',
      fit: 'cover'
    }).toBuffer()

    // Set params and run send command to save the image inside s3 buket AWS
    const imageName = generateRandomImageName()
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: buffer,
      ContentType: req.file?.mimetype
    }
    const command = new PutObjectCommand(params)
    await s3.send(command)

    // Setting properties to the body and saving the info in a variable
    req.body.imageProductName = imageName
    req.body.imageProductUrl = `https://project01-vini.s3.us-east-2.amazonaws.com/${imageName}`
    req.body.price = Number(req.body.price)
    req.body.rating = Number(req.body.rating)
    const productData = req.body

    // Saving the product into Railway database using prisma
    const product = await productClient.create({
      data: productData
    })

    res.status(201).json({data: product})

  } catch (error) {
    console.error('Error creating the product: ', error)
  }
}

// updateProduct

export async function updateProduct(req:Request, res: Response) {
  try {
    const productId = Number(req.params.id)
    req.body.price = Number(req.body.price)
    req.body.rating = Number(req.body.rating)
    const productData = req.body

    // Update the product info inside the Railway database
    const product = await productClient.update({
      where: {
        id: productId
      },
      data: productData
    })

    // Resize the image
    const buffer = await sharp(req.file?.buffer).resize({
      height: 800,
      width: 800,
      position: 'top',
      fit: 'cover'
    }).toBuffer()

    // Set params and run send command to save the image inside s3 buket AWS. The name must be equal to update the actual image
    const params = {
      Bucket: bucketName,
      Key: productData.imageProductName,
      Body: buffer,
      ContentType: req.file?.mimetype
    }
    const command = new PutObjectCommand(params)
    await s3.send(command)

    res.status(200).json({data: product})

  } catch (error) {
    console.error('Error updating the product: ', error)
  }
}

// DeleteProduct

export async function deleteProduct(req:Request, res: Response) {
  try {
    const productId = Number(req.params.id)
    const product = await productClient.findUnique({
      where: {
        id: productId
      }
    })
    if (!product) {
      res.send(404).send('Product not found')
    }

    // Deleting from the Railway database
    await productClient.delete({
      where: {
        id: productId
      }
    })

    const params = {
      Bucket: bucketName,
      Key: product?.imageProductName
    }

    // Deleting image from s3 bucket
    const command = new DeleteObjectCommand(params)
    await s3.send(command)

    res.status(200).json({data: {}})

  } catch (error) {
    console.error('Error deleting the product: ', error)
  }
}