'use client';
import { Contributor } from "@/models/Contributor";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function InputDOI() {
    const [tableShown, setTableShown] = useState<boolean>(false);
    const [searchVal, setSearchVal] = useState<string>("");
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();
    const contentType = "application/json";

    async function showResults(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setTableShown(false);
        const res = await fetch(`https://api.crossref.org/works?query=${searchVal}&rows=100`);
        const result = await res.json();
        setData(result.message.items);
        console.log(data);
        setTableShown(true);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchVal(value);
    };

    const addToDB = async (item: any) => {
        let i = 0;
        let title = "";
        let newContributor: Contributor = {
            contributorType: "",
            contributorFirstName: "",
            contributorLastName: "",
            contributorMiddleI: ""
        };
        let contributors = new Array<Contributor>();

        //If item.author is populated, move forward on that, otherwise, handle the error appropriately
        if (item.author) {
            for (i; i<item.author.length; i++) {
                newContributor = {
                    contributorType: "Author",
                    contributorFirstName: item.author[i].given,
                    contributorLastName: item.author[i].family,
                    contributorMiddleI: ""
                };
                contributors.push(newContributor);
            }
        }
        else {
            newContributor = {
                contributorType: "Author",
                contributorFirstName: "Unknown",
                contributorLastName: "Unknown",
                contributorMiddleI: ""
            };
            contributors.push(newContributor);
        }

        //If item.title is populated, move forward on that, otherwise, handle the error appropriately
        if (item.title) {
            title = item.title[0];
        }
        else {
            title = "Unknown";
        }
        
        let doiReference: any = {
            type: "journal",
            citekey: "please edit this",
            title: title,
            contributors: contributors,
            publisher: item.publisher,
            year: item.created['date-parts'][0][0],
            month: item.created['date-parts'][0][1],
            address: "",
            edition: "",
            volume: item.volume,
            isbn: "",
            doi: item.DOI,
            pages: item.page,
            journal: "",
            image_url: "",
        };
        
        try {
            const res = await fetch("/api/references", {
              method: "POST",
              headers: {
                Accept: contentType,
                "Content-Type": contentType,
              },
              body: JSON.stringify(doiReference),
            });
      
            // Throw error with status code in case Fetch API req failed
            if (!res.ok) {
              throw new Error(res.status.toString());
            }
            router.push("/");
            router.refresh();
          } catch (error) {
            console.log("Failed to add reference");
          }

    }

    return (
        <>
        <div className="flex flex-col">
            <form className="max-w-md mx-auto w-96" onSubmit={showResults}>   
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" value={searchVal} onChange={handleChange} className="block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search DOI Number..." required />
                    <button type="submit" className="text-white absolute end-px bottom-0 right-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
            </form>
            {tableShown && (
                <table className="table-auto">
                <thead>
                  <tr>
                    <th>DOI</th>
                    <th>Title</th>
                  </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.DOI}>
                            <td>{item.DOI}</td>
                            <td>{item.title}</td>
                            <td>
                                <button className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg w-24" onClick={() => addToDB(item)}>Add to list</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>
            )}
        </div>
        </>
    );
}

export default InputDOI;