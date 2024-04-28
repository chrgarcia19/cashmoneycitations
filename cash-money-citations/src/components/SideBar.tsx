"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BsTable, BsList } from "react-icons/bs";
import { GrGallery } from "react-icons/gr";
import { HiDocumentAdd } from "react-icons/hi";
import { IoPricetags } from "react-icons/io5";
import { FaHome, FaBook, FaBarcode, FaArrowDown } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdSpaceDashboard, MdGroup } from "react-icons/md";
import { useSession } from "next-auth/react";
import { Image } from "@nextui-org/react";
import { IoMdArrowDropdown } from "react-icons/io";

// import { getServerAuthSession } from "@/lib/auth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage icons visibility
  const { data: session, status } = useSession(); // Use useSession to access the session

  // Toggle function to show/hide icons
  const toggleIcons = () => setIsOpen(!isOpen);

  // Check if the user is logged in
  // Render null if not authenticated to hide the sidebar
  if (status !== "authenticated") {
    return null;
  }

  return (
    <>
      <div className="fixed flex flex-col top-0 z-40 items-center text-white transition-all ease-in-out duration-30 px-6">
        {/* Dedicated Toggle Button */}
        <div>
          <button
            onClick={toggleIcons}
            className="inline-block gap-6 rounded-full tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200 ease-in-out"
          >
            <div className="flex items-center">
              <Image 
                src={"cashmoneycitations_logo.png"}
                alt="Cash Money Citations Logo"
                width={65}
              />
              <IoMdArrowDropdown className="bg-black"/>
            </div>
          </button>
        </div>

        {/* Icons container, visibility controlled by isOpen state */}
        <div
          className={`flex mt-[10px] flex-col items-center transition-all ease-in-out duration-300 ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
        >
          <SideBarIcon href="/" icon={<FaHome size="20" />} tooltip="Home" />
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

          <SideBarIcon
            href="/group-center"
            icon={<MdGroup size="20" />}
            tooltip="Group Center"
          />

          <Divider />

          <SideBarIcon
            href="/search"
            icon={<FaMagnifyingGlass size="20" />}
            tooltip="Search"
          />

          <SideBarIcon
            href="/input"
            icon={<FaArrowDown size="20" />}
            tooltip="Input"
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

const Divider = () => (
  <hr className="my-2 border-gray-700 w-full dark:border-white" />
);

export default Sidebar;
