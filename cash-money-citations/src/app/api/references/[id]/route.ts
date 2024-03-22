import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex"
import User from "@/models/User";
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth';

// For API's use THIS TO GET PARAMS req: NextRequest, { params }: { params: { id: string } }
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  await dbConnect();

  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ?? '';
  const id = params.id;

  try {
    // Verifies that user owns reference
    const userOwnedRefs = await User.findById(userId).select("ownedReferences");
    const reference = await CSLBibModel.find({
      // Find references where _id matches userOwnedRefs
      _id: { $in: userOwnedRefs.ownedReferences ? id : null}
    });

    if (!reference) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: reference[0], status: 200 });
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
