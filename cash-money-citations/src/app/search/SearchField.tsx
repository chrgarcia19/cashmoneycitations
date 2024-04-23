"use client"
import React, { useState, useEffect } from "react";
import searchRefs from "./searchRefs";
import { useSession } from "next-auth/react";
import { CreateCslJsonDocument, HandleManualReference } from "@/components/componentActions/citationActions";
import { getUserReferences, getReferences } from '../../components/componentActions/actions';
import { useRouter } from "next/navigation";

class SearchFieldProps {
  searchRefs = searchRefs;
}

const SearchField: React.FC<SearchFieldProps> = ({searchRefs}) => {
  const { data: session } = useSession();
  const [refsArr, setRefsArr] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableShown, setTableShown] = useState<boolean>(false);
  const [userOwnedRefs, setUserOwnedRefs] = useState<any[]>([]);
  const router = useRouter();

  function monthConversion(month_num: string) {
    switch(month_num){
        case "0":
            return "January";
        case "1":
            return "February";
        case "2":
            return "March"; 
        case "3":
            return "April";
        case "4":
            return "May";
        case "5":
            return "June";
        case "6":
            return "July";
        case "7":
            return "August";
        case "8":
            return "September";
        case "9":
            return "October";
        case "10":
            return "November";
        case "11":
            return "December";   
        default:
            return (month_num + 1);     
    }
}

  async function getReference() {
    setTableShown(false);
    let arr = await searchRefs(searchTerm);
    let arrJSON = JSON.parse(arr);
    setRefsArr(arrJSON);
    //Checking to see if user owns refs or not
    console.log(session?.user?.id)
    const userOwnedRefsData = await getUserReferences(session?.user?.id ?? '');
    setUserOwnedRefs(userOwnedRefsData ?? []);
    setTableShown(true);
  }

  async function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      getReference();
    }
  }

  const addToDB = async (item: any) => {
    // Ensure item includes an ID field
    const itemWithId = { ...item, _id: undefined }; // Set _id to undefined to let MongoDB generate a new ID
    //Handling issues with tags
    const itemWithoutTags = { ...itemWithId, tags: [] };
    HandleManualReference(itemWithoutTags, session?.user?.id)
    router.push("/reference-table");
    router.refresh();
  }

  useEffect(() => {
    async function initialGetRefs() {
      setTableShown(false);
      let arr = await getReferences();
      setRefsArr(arr);
      //Checking to see if user owns refs or not
      const userId = session?.user?.id;
      if (userId){
        const userOwnedRefsData = await getUserReferences(userId);
        setUserOwnedRefs(userOwnedRefsData ?? []);
      }
      else {
        setUserOwnedRefs([]);
      }
      setTableShown(true);
    };
    initialGetRefs();
  }, [])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white">
      <div className="flex flex-col max-w-md mx-auto w-96">
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" id="default-search" value={searchTerm} onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => setSearchTerm(e.target.value)} className="block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by title..." required />
          <button type="submit" className="text-white absolute end-px bottom-0 right-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={getReference}>Search</button>
        </div>
      </div>

      {tableShown && (
        <div className="pb-20">
          <table className="table-auto w-full mt-4 border-solid">
            <thead className="bg-zinc-700 text-white">
              <tr>
                <th className="w-1/4 border-r">Title</th>
                <th className="w-1/4 border-r">Date Published</th>
                <th className="w-1/4 border-r">Contributors</th>
                <th className="w-1/4 border-r">Your Reference?</th>
                <th className="w-1/6">Action</th>
              </tr>
            </thead>
            <tbody>
              {refsArr.map(item => {
                // Check if the user owns the reference
                const isUserOwned = userOwnedRefs.some(ref => ref._id === item._id);
                return (
                  <tr key={item._id} className="border-b hover:bg-gray-100">
                    <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{item.title[0]}</td>
                    <td className="border border-slate-600 text-center">
                      {monthConversion(item.monthPublished)} {item.dayPublished}, {item.yearPublished}
                    </td>
                    <td className="border-r border-b border-l border-zinc-500 py-2 px-2">
                      {item.contributors.slice(0, 3).map((contributor: any) => {
                        return <div key={contributor._id}>{contributor.given}</div>
                      })}
                      {item.contributors.length > 3 ?
                          <div>And {item.contributors.length - 3} more</div> 
                          : ""
                      }
                    </td>
                    <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{isUserOwned ? "Yes" : "No"}</td>
                    <td className="border-r border-b border-l border-zinc-500 py-2 px-2">
                      <button className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg w-24" onClick={() => addToDB(item)}>Add to my list</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
};

export default SearchField;