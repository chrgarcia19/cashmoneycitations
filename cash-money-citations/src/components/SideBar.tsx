"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BsTable, BsList } from "react-icons/bs";
import { GrGallery } from "react-icons/gr";
import { HiDocumentAdd } from "react-icons/hi";
import { SiDoi } from "react-icons/si";
import { IoPricetags } from "react-icons/io5";
import { FaHome, FaBook, FaBarcode } from "react-icons/fa";
import { FaMusic } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { useSession } from "next-auth/react";
import { FaMagnifyingGlass } from "react-icons/fa6";

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
    
    <div className="fixed flex flex-col z-20 items-center text-white transition-all ease-in-out duration-30 mr-10">
      {/* Dedicated Toggle Button */}
      <div className="p-4">
        <button
          onClick={toggleIcons}
          className="mb-4 flex items-center opacity-0 justify-center bg-gray-800 p-3 rounded-full hover:bg-gray-500 transition duration-300 ease-in-out"
        >
          <BsList className="text-xl" size={40} />
        </button>
      </div>

      {/* Icons container, visibility controlled by isOpen state */}
      <div
        className={`flex mt-[10px] flex-col items-center transition-all ease-in-out duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
         <SideBarIcon
          href="/"
          icon={<FaHome size="20" />}
          tooltip="Home"
        />
         <SideBarIcon
          href="/dashboard"
          icon={<MdSpaceDashboard size="20" />}
          tooltip="Dashboard"
        />
        <SideBarIcon
          href="/new"
          icon={<HiDocumentAdd size="20" />}
          tooltip="Add Reference"
        />
        <SideBarIcon
          href="/input-isrc"
          icon={<FaMusic size="20" />}
          tooltip="Music Input"
        />
        
        <SideBarIcon
          href="/reference-gallery"
          icon={<GrGallery size="20" />}
          tooltip="Gallery View"
        />
        <SideBarIcon
          href="/reference-table"
          icon={<BsTable size="20" />}
          tooltip="Table View"
        />
        
        <SideBarIcon
          href="/tag-center"
          icon={<IoPricetags size="20" />}
          tooltip="Tag Center"
        />
        
        <SideBarIcon
          href="/search"
          icon={<GrGallery size="20" />}
          tooltip="Search"
        />
        
        <SideBarIcon
          href="input-doi"
          icon={<SiDoi size="20" />}
          tooltip="DOI Input"
        />
        <SideBarIcon
          href="input-isbn"
          icon={<FaBook size="20" />}
          tooltip="ISBN Input"
        />
        <SideBarIcon
          href="input-isbn"
          icon={<FaBarcode size="20" />}
          tooltip="ISSN Input"
        />
      </div>
    </div>
    </>
  );
};

const SideBarIcon = ({
  href,
  icon,
  tooltip,
}: {
  href: string;
  icon: JSX.Element;
  tooltip?: string;
}) => (
  <Link href={href}>
    <div className="sidebar-icon group">
    <div className="text-white p-2 bg-gray-800 dark:bg-gray-900 rounded-full shadow dark:shadow-md hover:bg-green-700 dark:hover:bg-gray-400 transition-all duration-300">
        {icon}
      </div>
      {tooltip && (
        <span className="sidebar-tooltip group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {tooltip}
        </span>
      )}
    </div>
  </Link>
);

const Divider = () => <hr className="my-2 border-gray-700 w-full" />;

export default Sidebar;
