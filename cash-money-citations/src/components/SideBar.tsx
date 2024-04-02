import React from 'react';
import Link from "next/link";
import { BsTable } from "react-icons/bs";
import { GrGallery } from "react-icons/gr";
import { HiDocumentAdd } from "react-icons/hi";
import { SiDoi } from "react-icons/si";
import { IoPricetags } from "react-icons/io5";
import { FaBook, FaBarcode } from "react-icons/fa";
import { getServerAuthSession } from "@/lib/auth";

const SideBarItem = ({ href, icon, label } : any) => (
  <li>
    <Link href={href}>
      <div className="sidebar-icon group">
        {icon}
        <span className="sidebar-tooltip group-hover:scale-100">{label}</span>
      </div>
    </Link>
  </li>
);

export default async function SideBar() {
  const authSession = await getServerAuthSession();

  return (
    <aside className='fixed top-0 left-0 h-screen w-16 flex flex-col bg-blue-300 dark:bg-gray-800 text-white shadow-lg z-40'>
      <div className="flex flex-col items-center justify-start pt-10">
        {authSession?.user && (
          <ul className="space-y-2">
            <SideBarItem href="/new" icon={<HiDocumentAdd size="28" />} label="Add Reference" />
            <SideBarItem href="/reference-gallery" icon={<GrGallery size="28" />} label="Gallery View" />
            <SideBarItem href="/reference-table" icon={<BsTable size="28" />} label="Table View" />
            <SideBarItem href="/tag-center" icon={<IoPricetags size="28" />} label="Tag Center" />
            <SideBarItem href="/input-doi" icon={<SiDoi size="28" />} label="DOI Input" />
            <SideBarItem href="/input-isbn" icon={<FaBook size="28" />} label="ISBN Input" />
            <SideBarItem href="/input-issn" icon={<FaBarcode size="28" />} label="ISSN Input" />
          </ul>
        )}
      </div>
    </aside>
  );
}
