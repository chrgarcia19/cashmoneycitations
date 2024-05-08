import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/utils/dbConnect";
import CSLLocaleModel from "@/models/CSLLocale";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
        
    try {
        
        const id = params.id;
        
        const locale = await CSLLocaleModel.findOneAndDelete({_id: id});
        return NextResponse.json({ success: true, data: locale, message: "Locale Deleted"}, {status: 201});
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ success: false }, { status: 400 });
    }
  
}