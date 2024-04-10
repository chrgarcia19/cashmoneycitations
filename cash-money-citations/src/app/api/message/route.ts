// import type { NextApiRequest, NextApiResponse } from 'next';
// import dbConnect from '../../../utils/dbConnect';
// import Message from '../../../models/MessageModel';

import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();
//   console.log(req.body, "req`")
//   const { name, email, message: messageContent } = req.body;

//   // TODO: Add validation for name, email, and messageContent here

//   try {
//     const messageDoc = await Message.create({ name, email, message: messageContent });
//     res.status(201).json({ success: true, data: messageDoc });
//   } catch (error) {
//     console.error('Request error', error instanceof Error ? error.message : 'Unknown Error');
//     res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' });
//   }
// }

// I had to comment out all of this to be able to build the project


// To access data be sure to think about it like a normal JavaScript API
export async function POST(request: NextRequest) {

  await dbConnect();
  
  const req = await request.json();

  try {
    // THIS POST REQUEST IS A PLACEHOLDER IN ORDER TO GET THE PROJECT TO BUILD
    return NextResponse.json({ success: true, data: req }, { status: 201});
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
