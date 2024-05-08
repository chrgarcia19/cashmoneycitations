import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
        
    try {
        
        const id = params.id;
        
        const user = await User.findOneAndDelete({_id: id});
        return NextResponse.json({ success: true, data: user, message: "User Deleted"}, {status: 201});
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ success: false }, { status: 400 });
    }
  
}