import React from "react";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import Profile from "./components/UserProfile";


export default async function UserProfilePage({ params }: { params: any }) {

    return (
        <>
         <Profile />
        </>
    )
}