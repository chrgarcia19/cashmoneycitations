import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
        
    try {
        
        const id = params.id;
        
        const style = await CSLStyleModel.findOneAndDelete({_id: id});
        return NextResponse.json({ success: true, data: style, message: "Style Deleted"}, {status: 201});
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ success: false }, { status: 400 });
    }
  
}