import React from "react";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
//import Profile from "./components/UserProfile";
import Profile from "./components/Profile";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";


export default async function UserProfilePage() {
    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? "";
    const userImage = session?.user?.image;

    return (
        <>
         <Profile userId={userId} userImage={userImage} />
        </>
    )
}