import { NextResponse } from 'next/server';
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

export async function PUT(request: Request) {
    await dbConnect();
        
    try {
        
        const req = await request.formData();
        const currentEmail = req.get('userEmail');
        const newEmail = req.get('email');
        const username = req.get('username');
        const role = req.get('userRoleSelect');

        let updateFields: Record<string, any> = {};

        if (newEmail) {
            updateFields.email = newEmail;
        }

        if (username) {
            updateFields.username = username;
        }

        if (role) {
            updateFields.role = role;
        }
        

        const user = await User.findOneAndUpdate({email: currentEmail}, updateFields, { new: true});
        return NextResponse.json({ success: true, data: user, message: "User Updated"}, {status: 201});
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ success: false }, { status: 400 });
    }
  
}

export async function POST(request: Request) {
    await dbConnect();
        
    try {
        
        const req = await request.formData();

        const email = req.get('userEmail');

        // Update user

        const user = await User.findOneAndDelete({email});
        return NextResponse.json({ success: true, data: user, message: "User Updated"}, {status: 201});
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ success: false }, { status: 400 });
    }
  
}