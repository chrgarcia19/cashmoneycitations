import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CSLLocaleModel from "@/models/CSLLocale";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {


  await dbConnect();

  const id = request.body;
  
  try {
    
    const cslStyleData = await CSLLocaleModel.find(); /* find all the data in our database */
    return NextResponse.json({ success: true, data: cslStyleData, message: id }, { status: 200});
  } catch (error) {
    return NextResponse.json({ success: false , data: id}, { status: 400});
  }
  
}

export async function DELETE(request: Request) {
  await dbConnect();
      
  try {
      
      const req = await request.formData();
      const name = req.get('name');

      // Delete CSL Locale
      const locale = await CSLLocaleModel.findOneAndDelete({name});
      return NextResponse.json({ success: true, data: locale, message: "CSL Locale Deleted"}, {status: 201});
  } catch (error) {
      console.log({ error });
      return NextResponse.json({ success: false }, { status: 400 });
  }

}