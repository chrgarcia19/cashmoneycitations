import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import url from "url";
import bcryptjs from "bcryptjs"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    await dbConnect();

    const id = request.body;
    const queryParams = url.parse(request.url, true).query;

    try {
        const user = await User.find();
        return NextResponse.json({ success: true, data: user, message: id }, { status: 200});
    } catch (error) {
        return NextResponse.json({ success: false , data: id}, { status: 400});
    }
}

export async function PUT(request: NextRequest) {
    await dbConnect();

    const req = await request.json();

    try {
        const user = await User.create(
            req,
        );
        return NextResponse.json({ success: true, data: user}, {status: 201});
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function POST(request: NextRequest){
    await dbConnect();

    try {
        const reqBody = await request.json()
        const {username, first_name, last_name, email, password} = reqBody

        const user = await User.findOne({email})

        if(user) {
            return NextResponse.json({error: "Email already exists"}, {status: 400})

        }
        const userCreate = await User.create(
            reqBody,
        );
        return NextResponse.json({ success: true, data: userCreate}, {status: 201});
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }



    
}