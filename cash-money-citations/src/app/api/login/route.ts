import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export const dynamic = 'force-dynamic';

export async function GET() {

  await dbConnect();

  try {
    const users = await User.find({}); /* find all the data in our database */
    return NextResponse.json({ success: true, data: users }, { status: 200});
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400});
  }
  
}

export async function POST(
  req: Request,
  
) {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });

    // If the user doesn't exist or the password is incorrect, send an error
    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 400});
    }

    // Create a JWT
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');

    // Send the JWT to the client
    NextResponse.json({ token }, { status: 200});
  } catch (error) {
    console.error(error);
    NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}



