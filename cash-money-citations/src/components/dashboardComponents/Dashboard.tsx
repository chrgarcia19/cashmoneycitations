import React from "react";
import { FaSearch, FaFileExport, FaGlobeAmericas, FaBook, FaBarcode, FaIdBadge, FaKey } from "react-icons/fa";
import UserReferenceCounter from "./UserReferenceCounter";
import CitationStyleCounter from "./CitationStyleCounter";
import MostUsedLanguage from "./MostUsedLanguage";
import UserInfo from "./UserInfo";

const Dashboard = () => {

  


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 py-10 px-5 md:px-10">
    <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-200 mb-10">Welcome to Your Dashboard</h1>
    <div className="my-10">
    <UserInfo />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <UserReferenceCounter />
      <CitationStyleCounter />
      <MostUsedLanguage />
    </div>
  </div>
  
  );
};

export default Dashboard;
