// import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'

interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
}

export async function POST(req: Request, res: Response) {
  if (req.method === 'POST') {
    // const body = await JSON.parse(req.body)

    // console.log(body)
    // const { name, email, phone } = await JSON.parse(req.body) as CreateUserRequest;
    // console.log( 'req.body: ' , req.body)
    // console.log(name, email, phone)
    
    // try {
    //   await prisma.user.create({
    //     data: {
    //       name: name,
    //       email: email,
    //       phone: phone
    //     }
    //   });
      
    //   return res.status(201);
    //   res.status(201).json(newUser);
    // } catch (error) {
    //   console.error('Error creating user:', error);
    //   return res.status(500).json({ error: 'Error creating user' });
    // }
    // return res.status(200)

  } else {
    // return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
