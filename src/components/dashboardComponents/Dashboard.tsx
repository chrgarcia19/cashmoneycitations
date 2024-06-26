import React from "react";
import UserReferenceCounter from "./UserReferenceCounter";
import CitationStyleCounter from "./CitationStyleCounter";
import UserInfo from "./UserInfo";
import { getSpecificUserById, getUserReferences } from "../componentActions/actions";
import { getServerAuthSession } from "@/lib/auth";
import dbConnect from "@/utils/dbConnect";
import CSLStyle from "@/models/CSLStyle";
import { LogCMCError } from "../componentActions/logActions";
import AddReferences from "./AddReferences";

async function countCSLStyles() {
  await dbConnect();

  try {
    const result = await CSLStyle.find({});
    const length = result.length;
    return length;
  } catch (e: any) {
    LogCMCError("CRITICAL", "DATABASE", e);
    console.error(e);
    return [];
  }
}


const Dashboard = async () => {

  const session = await getServerAuthSession();
  const user = await getSpecificUserById(session?.user?.id) ?? '';
  const references = await getUserReferences(user.id);
  const referenceCount = references?.length ?? 0; 
  const cslStyleCount = await countCSLStyles() ?? 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 py-10 px-5 md:px-10">
    <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-200 mb-10">Welcome to Your Dashboard</h1>
    <div className="my-10">
    <UserInfo user={user} />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AddReferences />
      <UserReferenceCounter userReferenceCount={referenceCount} />
      <CitationStyleCounter styleCount={cslStyleCount} />
    </div>
  </div>
  
  );
};

export default Dashboard;
