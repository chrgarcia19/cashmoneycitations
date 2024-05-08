import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Citation from "@/models/Citation";

// For API's use THIS TO GET PARAMS req: NextRequest, { params }: { params: { id: string } }
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  await dbConnect();

  const id = params.id;

  try {
    const citation = await Citation.find({
        _id: id,
    });

    if (!citation) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: citation[0], status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, status: 400 , data: id});
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const id = params.id;
  console.log(id)

  try {
    const deletedCitation = await Citation.deleteOne({ _id: id });

    if (!deletedCitation) {
      return NextResponse.json({ success: false, message: "Citation not deleted!"}, { status: 400 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
