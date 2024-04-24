"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BsTable, BsList } from "react-icons/bs";
import { GrGallery } from "react-icons/gr";
import { HiDocumentAdd } from "react-icons/hi";
import { IoPricetags } from "react-icons/io5";
import { FaHome, FaBook, FaBarcode, FaArrowDown } from "react-icons/fa";
import { MdSpaceDashboard, MdGroup } from "react-icons/md";
import { useSession } from "next-auth/react";

// import { getServerAuthSession } from "@/lib/auth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage icons visibility
  const { data: session, status } = useSession(); // Use useSession to access the session


  // Toggle function to show/hide icons
  const toggleIcons = () =>  setIsOpen(!isOpen);

  // Check if the user is logged in
  // Render null if not authenticated to hide the sidebar
  if (status !== "authenticated") {
    return null;
  }


    return (
      <>
         <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-32 transition-transform -translate-x-full bg-blue-300 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-blue-300 dark:bg-gray-800">
               {authSession?.user && (
               <ul className="space-y-2 font-medium">
                  <li>
                     <Link 
                        href="/new"
                        className="flex items-center p-2 text-gray-900 rounded-lg font-bold dark:text-white hover:bg-blue-200 dark:hover:bg-gray-700 group">
                        <HiDocumentAdd />
                        <span className="ms-3">Add Reference</span>
                     </Link>
                  </li>
                  <li>
                     <Link 
                        href="/reference-gallery"
                        className="flex items-center p-2 text-gray-900 rounded-lg font-bold dark:text-white hover:bg-blue-200 dark:hover:bg-gray-700 group">
                        <GrGallery />
                        <span className="ms-3">Gallery View</span>
                     </Link>
                  </li>
                  <li>
                     <Link 
                        href="/reference-table"
                        className="flex items-center p-2 text-gray-900 rounded-lg font-bold dark:text-white hover:bg-blue-200 dark:hover:bg-gray-700 group">
                        <BsTable />
                        <span className="ms-3">Table View</span>
                     </Link>
                  </li>
                  <li>
                     <Link 
                        href="/tag-center"
                        className="flex items-center p-2 text-gray-900 rounded-lg font-bold dark:text-white hover:bg-blue-200 dark:hover:bg-gray-700 group">
                        <IoPricetags />
                        <span className="ms-3">Tag Center</span>
                     </Link>
                  </li>
                  <li>
                     <Link 
                        href="/search"
                        className="flex items-center p-2 text-gray-900 rounded-lg font-bold dark:text-white hover:bg-blue-200 dark:hover:bg-gray-700 group">
                        <FaMagnifyingGlass />
                        <span className="ms-3">Search</span>
                     </Link>
                  </li>
                  <li>
                     <Link 
                        href="/input"
                        className="flex items-center p-2 text-gray-900 rounded-lg font-bold dark:text-white hover:bg-blue-200 dark:hover:bg-gray-700 group">
                        <FaArrowDown />
                        <span className="ms-3">Input</span>
                     </Link>
                  </li>
               </ul>
               )}
            </div>
         </aside> 
      </>
    )
}