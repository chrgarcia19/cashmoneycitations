import { NextResponse } from 'next/server';
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
    await dbConnect();
        
    try {
        
        const req = await request.formData();
        const currentEmail = req.get('userEmail');
        const newEmail = req.get('newEmail');
        const username = req.get('newUsername');
        const newPassword = req.get('newPassword')?.toString();
        const role = req.get('userRoleSelect');
        
        let updateFields: Record<string, any> = {};

        if (newPassword) {       
            // Get current hashed password
            const currentPassword = await User.findOne({email: currentEmail}, 'password').exec();
            const currentHashedPassword = currentPassword.password;
            // Compare current with old password
            const passwordMatch = await bcrypt.compareSync(newPassword, currentHashedPassword);
            if (passwordMatch){
                return NextResponse.json({ success: false, message: "New password cannot match old password" }, { status: 400 });
            } else {         
                // Hash the new password
                const salt = await bcrypt.genSalt(10);
                const newHashedPassword = await bcrypt.hash(newPassword, salt);

                updateFields.password = newHashedPassword;
            }
        }

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

export async function DELETE(request: Request) {
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