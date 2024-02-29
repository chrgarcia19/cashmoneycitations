import { NextResponse } from 'next/server';
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

export async function GET(request: Request) {

    await dbConnect();
      
    try {
        const result = await User.find({});
        return NextResponse.json({ success: true, data: result}, { status: 200 })
    } catch(error) {
        return NextResponse.json({ success: false}, { status: 400});

    }

}