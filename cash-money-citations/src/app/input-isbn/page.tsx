'use client';
import { Contributor } from "@/models/Contributor";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function InputISBN() {
    const [tableShown, setTableShown] = useState<boolean>(false);
    const [searchVal, setSearchVal] = useState<string>("");
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();
    const contentType = "application/json";
    const errorItem: any = [
        {
            volumeInfo: {
                title: "Please insert a complete ISBN Number"
            }
        }
    ]

    function monthConversion(month_num: number) {
        switch(month_num){
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March"; 
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";   
            default:
                return month_num;     
        }
    }
        

    async function showResults(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setTableShown(false);
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${searchVal}&maxResults=1`);
        const result = await res.json();
        if (result.items){
            setData(result.items);
        }
        else {
            setData(errorItem)
        }
        setTableShown(true);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchVal(value);
    };

    const addToDB = async (item: any) => {
        let i = 0;
        let authorArray = [];
        let newContributor: Contributor = {
            contributorType: "",
            contributorFirstName: "",
            contributorLastName: "",
            contributorMiddleI: ""
        };
        let contributors = new Array<Contributor>();

        //If item.volumeInfo.authors is populated, move forward on that, otherwise, handle the error appropriately
        if (item.volumeInfo.authors) {
            for (i; i<item.volumeInfo.authors.length; i++) {
                //Splitting Contributor Names into first/last name/middle initial
                let count = 0;
                let firstName = "";
                let lastName = "";
                let middleI = "";
                for (let j = 0; j < item.volumeInfo.authors[i].length; j++) {
                    if (item.volumeInfo.authors[i][j] === ' ') {
                        count++;
                    }
                }
                if (count === 1) {
                    authorArray = item.volumeInfo.authors[i].split(" ");
                    firstName = authorArray[0];
                    lastName = authorArray[1];
                }
                else if (count === 2) {
                    authorArray = item.volumeInfo.authors[i].split(" ");
                    firstName = authorArray[0];
                    middleI = authorArray[1];
                    lastName = authorArray[2];
                }

                //Acquire data from if/else statements, throw it into the contributor field
                newContributor = {
                    contributorType: "Author",
                    contributorFirstName: firstName,
                    contributorLastName: lastName,
                    contributorMiddleI: middleI
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
        let publishedArray = [];
        let year = "";
        let month = "";
        let day = "";

        //Splitting the publishedDate into month, year, day if appropriate
        if (item.volumeInfo.publishedDate.includes("-")){
            publishedArray = item.volumeInfo.publishedDate.split("-");
            year = publishedArray[0];
            month = publishedArray[1];
            day = publishedArray[2];
        }
        else {
            year = item.volumeInfo.publishedDate;
        }

        

        //Handling image info
        let imageLink = "";
        if (item.volumeInfo.imageLinks.thumbnail) {
            imageLink = item.volumeInfo.imageLinks.thumbnail;
        }
        else {
            imageLink = "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3N2MTU5NDA3LWltYWdlLWt3dng3MmFlLmpwZw.jpg";
        }

        //Handling publisher info
        let publisher = ""
        if (item.volumeInfo.publisher) {
            publisher = item.volumeInfo.publisher;
        }
        else {
            publisher = "Unknown";
        }
        
        let doiReference: any = {
            type: "book",
            citekey: "",
            title: item.volumeInfo.title,
            contributors: contributors,
            publisher: publisher,
            year: year,
            month: monthConversion(parseInt(month)),
            address: "",
            edition: "",
            volume: "",
            isbn: searchVal,
            doi: "",
            pages: "",
            journal: "",
            image_url: imageLink,
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
            router.push("/reference-table");
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
                    <input type="search" id="default-search" value={searchVal} onChange={handleChange} className="block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search ISBN Number..." required />
                    <button type="submit" className="text-white absolute end-px bottom-0 right-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
            </form>
            {tableShown && (
                <table className="table-auto mt-4 border-solid">
                <thead className="bg-zinc-700 text-white">
                  <tr>
                    <th>ISBN</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={searchVal} className="border-b hover:bg-gray-100">
                            <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{searchVal}</td>
                            <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{item.volumeInfo.title}</td>
                            <td className="border-r border-b border-l border-zinc-500 py-2 px-2">
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

export default InputISBN;