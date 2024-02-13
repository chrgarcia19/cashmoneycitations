import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

export async function GET(request: NextRequest, { params }: {params: {id: string}}) {
    await dbConnect();

    const id = params.id;

    try {
        const user = await User.findById(id);

        if (!user){ return NextResponse.json({ success: false}, { status: 400}); }
        return NextResponse.json({ success: true, data: user, status: 200});
    } catch (error) {
        return NextResponse.json({ success: false , data: id}, { status: 400});
    }
}

export async function PUT(request: NextRequest, { params }: {params: {id: string}}) {
    await dbConnect();

    const req = await request.json();
    const id = params.id;

    try {
        const user = await User.findByIdAndUpdate(
            id, req, {
                new: true,
                runValidators: true,})
        return NextResponse.json({ success: true, data: user, status: 201});
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: {params: {id: string}}){
    await dbConnect();

    const id = params.id;

    try {
        const deletedUser = await User.deleteOne({_id: id});

        if (!deletedUser) { return NextResponse.json({ success: false, status: 400}); }
        return NextResponse.json({ success: true, data: {}, status: 200});
    } catch (error) {
        return NextResponse.json({ success: false, status: 400 });
    }
}