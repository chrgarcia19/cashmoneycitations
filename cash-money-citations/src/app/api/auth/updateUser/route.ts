import { NextResponse } from 'next/server';
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

export async function PUT(request: Request) {
    await dbConnect();
        
    try {
        
        const req = await request.formData();

        const email = req.get('userEmail');
        const role = req.get('userRoleSelect');

        // Update user
        const update = { role: role }

        const user = await User.findOneAndUpdate({email}, update);
        return NextResponse.json({ success: true, data: user, message: "User Updated"}, {status: 201});
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ success: false }, { status: 400 });
    }
  
}