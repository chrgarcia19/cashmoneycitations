import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "../../../../../utils/dbConnect";
import User from "../../../../../models/User";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    await dbConnect();

    const id = params.id;

    try {
        const result = await User.findById(id);

        if (!result) {
            return NextResponse.json({ success: false }, { status: 400 });
        }
        return NextResponse.json({ success: true, data: result}, { status: 200 })
    } catch(error) {
        return NextResponse.json({ success: false}, { status: 400});

    }



}