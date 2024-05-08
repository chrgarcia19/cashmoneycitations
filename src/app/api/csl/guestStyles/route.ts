import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";


export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  await dbConnect();

  const id = request.body;
  
  try {
    



    const CSLTitles = ["IEEE", "ACM SIGGRAPH", "Modern Language Association 9th edition"];

    const cslStyleData = await CSLStyleModel.find({
      title: { $in: CSLTitles }
    },
    { title: 1, _id: 1}
    );
    
    return NextResponse.json({ success: true, data: cslStyleData, message: id }, { status: 200});
  } catch (error) {
    return NextResponse.json({ success: false , data: id}, { status: 400});
  }
  
}

