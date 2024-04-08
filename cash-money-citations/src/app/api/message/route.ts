// src/app/api/message/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Message from '../../../models/MessageModel';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const messages = await Message.find();
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const message = await Message.create(req.body);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Request error', (error as Error).message);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
  
}

// export async function put(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();
//   // Implementation for PUT request
//   // ...
// }
