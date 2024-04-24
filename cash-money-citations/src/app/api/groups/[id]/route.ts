import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Group from "@/models/Group";

// For API's use THIS TO GET PARAMS req: NextRequest, { params }: { params: { id: string } }

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  await dbConnect();



  const id = params.id;

  try {

    const tag = await Group.findById(id);

    if (!tag) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: tag, status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, status: 400 , data: id});
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const id = params.id;

  try {
    const deletedGroup = await Group.deleteOne({ _id: id });

    if (!deletedGroup) {
      return NextResponse.json({ success: false, message: "Group not deleted!"}, { status: 400 });
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

    const tag = await Group.findByIdAndUpdate(id, req, {
      new: true,
      runValidators: true,})
    return NextResponse.json({ success: true, data: tag }, { status: 201});
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
