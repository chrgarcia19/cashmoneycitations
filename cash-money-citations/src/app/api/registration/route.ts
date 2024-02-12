import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import url from "url";
import bcrypt from 'bcryptjs';

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
        const req = await request.json();

        const { username, firstName, lastName, email, password } = req;

        const userExists = await User.findOne({email});

        if(userExists){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
    
        // Create a new user
        const user = new User({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await user.save();
        return NextResponse.json({ success: true, data: user, message: "User created"}, {status: 201});
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}