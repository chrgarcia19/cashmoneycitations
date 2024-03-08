import { NextResponse, NextRequest } from "next/server";
import url from "url";
import dbConnect from "../../../utils/dbConnect";
import JournalRef  from "@/models/reference-models/JournalRef";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {


  await dbConnect();

  const id = request.body;
  const queryParams = url.parse(request.url, true).query;
  
  try {
    
    const reference = await JournalRef.find(); /* find all the data in our database */
    return NextResponse.json({ success: true, data: reference, message: id }, { status: 200});
  } catch (error) {
    return NextResponse.json({ success: false , data: id}, { status: 400});
  }
  
}

export async function PUT(request: NextRequest) {

  await dbConnect();

  const req = await request.json();
  
  try {
    const reference = await JournalRef.create(
      req,
    ); /* create a new model in the database */
    return NextResponse.json({ success: true, data: reference }, { status: 201});
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// To access data be sure to think about it like a normal JavaScript API
export async function POST(request: NextRequest) {

  await dbConnect();
  
  const req = await request.json();

  try {
    const reference = await JournalRef.create(
      req,
    ); /* create a new model in the database */
    return NextResponse.json({ success: true, data: reference }, { status: 201});
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}



