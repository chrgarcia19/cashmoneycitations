import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Reference from "@/models/Reference";
import CSLBibModel from "@/models/CSLBibTex"
// For API's use THIS TO GET PARAMS req: NextRequest, { params }: { params: { id: string } }

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  await dbConnect();



  const id = params.id;

  try {

    const reference = await CSLBibModel.findById(id);

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
    const deletedReference = await CSLBibModel.deleteOne({ _id: id });

    if (!deletedReference) {
      return NextResponse.json({ success: false, message: "Reference not deleted!"}, { status: 400 });
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

    const reference = await CSLBibModel.findByIdAndUpdate(id, req, {
      new: true,
      runValidators: true,})
    return NextResponse.json({ success: true, data: reference }, { status: 201});
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
