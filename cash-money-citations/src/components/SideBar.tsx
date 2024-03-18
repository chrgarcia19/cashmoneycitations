import Link from "next/link";
import { BsTable } from "react-icons/bs";
import { GrGallery } from "react-icons/gr";
import { HiDocumentAdd } from "react-icons/hi";
import { SiDoi } from "react-icons/si";

export default function SideBar(){
    return (
        <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-32 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
   <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
         <li>
            <Link 
                href="/new"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <HiDocumentAdd />
               <span className="ms-3">Add Reference</span>
            </Link>
         </li>
         <li>
            <Link 
                href="/reference-gallery"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <GrGallery />
                <span className="ms-3">Gallery View</span>
            </Link>
         </li>
         <li>
            <Link 
                href="/reference-table"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <BsTable />
                <span className="ms-3">Table View</span>
            </Link>
         </li>
         <li>
            <Link 
                href="/input-doi"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <SiDoi />
                <span className="ms-3">DOI Input</span>
            </Link>
         </li>
      </ul>
   </div>
</aside>
    )
}