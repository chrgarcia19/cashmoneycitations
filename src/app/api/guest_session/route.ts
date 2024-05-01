// File: /app/api/guest_session/route.ts
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST (request: NextRequest) {

  try {

  const guestToken = jwt.sign(
    { guest: true, exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) }, // Token expires in 24 hours
    process.env.JWT_SECRET as string
    );
    return NextResponse.json({ success: true, data: guestToken }, { status: 201});
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
   
};
