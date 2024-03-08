import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {


  await dbConnect();

  const id = request.body;
  
  try {
    
    const cslStyleData = await CSLStyleModel.find(); /* find all the data in our database */
    return NextResponse.json({ success: true, data: cslStyleData, message: id }, { status: 200});
  } catch (error) {
    return NextResponse.json({ success: false , data: id}, { status: 400});
  }
  
}