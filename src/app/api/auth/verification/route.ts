import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import User from "@/models/User";
import LoginForm from "@/components/LoginForm";

export const POST = async ( request: NextRequest) => {
    const credentials = await request.json();

    const username = credentials['username']
    const password = credentials['password']
    
    try {
      await dbConnect();
      const user = await User.findOne({username: username});

      if (!user){
        return null;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch){
        console.log("ERRROR WITH PASSWORD")
      }

      return user;
    } catch (error) {
      console.log("Error: ", error);
    }
  }