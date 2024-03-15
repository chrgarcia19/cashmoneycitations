import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Tag from "@/models/Tag";

// For API's use THIS TO GET PARAMS req: NextRequest, { params }: { params: { id: string } }

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  await dbConnect();



  const id = params.id;

  try {

    const reference = await Tag.findById(id);

    if (!reference) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: reference, status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, status: 400 , data: id});
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const id = params.id;

  try {
    const deletedTag = await Tag.deleteOne({ _id: id });

    if (!deletedTag) {
      return NextResponse.json({ success: false, message: "Tag not deleted!"}, { status: 400 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {

  await dbConnect();

  const req = await request.json();
  const id = params.id

  try {

    const reference = await Tag.findByIdAndUpdate(id, req, {
      new: true,
      runValidators: true,})
    return NextResponse.json({ success: true, data: reference }, { status: 201});
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
