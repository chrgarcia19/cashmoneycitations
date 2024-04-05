"use client"
import React, { useState } from "react";
import searchRefs from "./searchRefs";
import { useSession } from "next-auth/react";
import { CreateCslJsonDocument, HandleManualReference } from "@/components/componentActions/citationActions";
import { useRouter } from "next/navigation";

class SearchFieldProps {
  searchRefs = searchRefs;
}

const SearchField: React.FC<SearchFieldProps> = ({searchRefs}) => {
  const { data: session } = useSession();
  const [refsArr, setRefsArr] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableShown, setTableShown] = useState<boolean>(false);
  const router = useRouter();
  
  async function getReference() {
    setTableShown(false);
    let arr = await searchRefs(searchTerm);
    let arrJSON = JSON.parse(arr);
    setRefsArr(arrJSON);
    setTableShown(true);
  }

  const addToDB = async (item: any) => {
    // Ensure item includes an ID field
    const itemWithId = { ...item, _id: undefined }; // Set _id to undefined to let MongoDB generate a new ID
    const itemWithoutTags = { ...itemWithId, tags: []};
    HandleManualReference(itemWithoutTags, session?.user?.id)
    router.push("/reference-table");
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-col max-w-md mx-auto w-96">
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" id="default-search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by title..." required />
          <button type="submit" className="text-white absolute end-px bottom-0 right-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={getReference}>Search</button>
        </div>
      </div>

      <div className="m-10 items-center w-auto">
        {tableShown && (
          <table className="table-auto mt-4 border-solid">
            <thead className="bg-zinc-700 text-white">
              <tr>
                <th>Title</th>
                <th>Date Published</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {refsArr.map(item => (
                <tr key={item._id} className="border-b hover:bg-gray-100">
                  <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{item.title[0]}</td>
                  <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{item.date}</td>
                  <td className="border-r border-b border-l border-zinc-500 py-2 px-2">
                    <button className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg w-24" onClick={() => addToDB(item)}>Add to my list</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SearchField;