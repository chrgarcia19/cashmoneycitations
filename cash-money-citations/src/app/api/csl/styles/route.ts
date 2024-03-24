import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";
import UserStyleList from "@/models/UserStyleList";
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  await dbConnect();

  const id = request.body;
  
  try {
    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';

    const userStyles = await UserStyleList.findOne({
      userId: userId
    });

    const CSLTitles = userStyles.defaultStyles;

    const cslStyleData = await CSLStyleModel.find({
      title: { $in: CSLTitles }
    });
    
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

      // Delete CSL Style
      const style = await CSLStyleModel.findOneAndDelete({name});
      return NextResponse.json({ success: true, data: style, message: "CSL Style Deleted"}, {status: 201});
  } catch (error) {
      console.log({ error });
      return NextResponse.json({ success: false }, { status: 400 });
  }

}