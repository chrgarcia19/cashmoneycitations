import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

export async function POST(request: Request) {
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
            role: 'user',
        });

        // Save the user to the database
        await user.save();
        return NextResponse.json({ success: true, data: user, message: "User created"}, {status: 201});
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ success: false }, { status: 400 });
    }
  
}