import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Message from '../../../models/MessageModel';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  console.log(req.body, "req`")
  const { name, email, message: messageContent } = req.body;

  // TODO: Add validation for name, email, and messageContent here

  try {
    const messageDoc = await Message.create({ name, email, message: messageContent });
    res.status(201).json({ success: true, data: messageDoc });
  } catch (error) {
    console.error('Request error', error instanceof Error ? error.message : 'Unknown Error');
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' });
  }
}
