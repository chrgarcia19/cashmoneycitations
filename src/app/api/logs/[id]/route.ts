import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CMCLogModel from "@/models/Log"
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
  
    const id = params.id;
  
    try {
      const deletedLog = await CMCLogModel.deleteOne({ _id: id });
  
      if (!deletedLog) {
        return NextResponse.json({ success: false, message: "Log not deleted!"}, { status: 400 });
      }
      return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
  }
  