import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import url from "url";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    await dbConnect();

    const id = request.body;
    const queryParams = url.parse(request.url, true).query;

    try {
        const user = await User.find();
        return NextResponse.json({ success: true, data: user, message: id }, { status: 200});
    } catch (error) {
        return NextResponse.json({ success: false , data: id}, { status: 400});
    }
}

export async function PUT(request: NextRequest) {
    await dbConnect();

    const req = await request.json();

    try {
        const user = await User.create(
            req,
        );
        return NextResponse.json({ success: true, data: user}, {status: 201});
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function POST(request: NextRequest){
    await dbConnect();

    const req = await request.json();

    try {
        const user = await User.create(
            req,
        );
        return NextResponse.json({ success: true, data: user}, {status: 201});
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}