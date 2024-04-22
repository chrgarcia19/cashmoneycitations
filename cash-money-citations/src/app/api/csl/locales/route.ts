import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CSLLocaleModel from "@/models/CSLLocale";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {


  await dbConnect();

  
  try {
    
    const cslStyleData = await CSLLocaleModel.find(); /* find all the data in our database */
    let cslStyleDataObjects = cslStyleData.map(doc => {
      let object = doc.toObject();
      object._id = object._id.toString();

        // Convert all other non-simple properties to simple values
        for (let key in object) {
          if (typeof object[key].toJSON === 'function') {
            object[key] = object[key].toJSON();
          }
        }
      return object;
    });

    return NextResponse.json({ success: true, data: cslStyleDataObjects}, { status: 200});
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400});
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