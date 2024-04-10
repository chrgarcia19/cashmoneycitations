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

import { getServerAuthSession } from "@/lib/auth";


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
    
    <div className="fixed z-50 flex flex-col items-center text-white transition-all ease-in-out duration-300">
      {/* Dedicated Toggle Button */}
      <div className="p-4 mt-[-100px] ml-[-10px]">
        <button
          onClick={toggleIcons}
          className="mb-4 flex items-center opacity-0   justify-center bg-gray-800 p-3 rounded-full hover:bg-gray-500 transition duration-300 ease-in-out"
        >
          <BsList className="text-xl" size={32} />
        </button>
      </div>

      {/* Icons container, visibility controlled by isOpen state */}
      <div
        className={`flex mt-[-20px] flex-col items-center transition-all ease-in-out duration-300 ${
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
        <Divider />
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
        <Divider />
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
        <Divider />
        <SideBarIcon
          href="/tag-center"
          icon={<IoPricetags size="20" />}
          tooltip="Tag Center"
        />
        <Divider />
        <SideBarIcon
          href="/search"
          icon={<GrGallery size="20" />}
          tooltip="Search"
        />
        <Divider />
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
      <div className="text-center text-sm cursor-pointer flex items-center justify-center h-6 w-6 mx-auto group-hover:scale-80 transition-transform duration-200">
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
