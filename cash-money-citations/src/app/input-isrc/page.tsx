'use client';
import { Contributor } from "@/models/Contributor";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CreateCslJsonDocument, HandleManualReference } from "@/components/componentActions/citationActions";
import { useSession } from "next-auth/react";

function InputCDDB() {
    const { data: session } = useSession();
    const [tableShown, setTableShown] = useState<boolean>(false);
    const [searchVal, setSearchVal] = useState<string>("");
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();
    const errorItem: any = [
        {
            ['artist-credit']: {
                name: "Unknown"
            },
            title: "Unknown"
        }
    ]

    async function showResults(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setTableShown(false);
        const res = await fetch(`http://musicbrainz.org/ws/2/recording/?query=title:${searchVal}&fmt=json`);
        const result = await res.json();
        if (result.recordings && result.recordings.length !== 0){
            setData(result.recordings);
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
        let newContributor: Contributor = {
            role: "",
            firstName: "",
            lastName: "",
            middleName: "",
            suffix: ""
        };
        let contributors = new Array<Contributor>();

        //If item.artist-credit is populated, populate the contributor array
        if (item['artist-credit']) {
            for (i; i<item['artist-credit'].length; i++) {
                if (/\s/.test(item['artist-credit'][i].name)) {
                    let names = item['artist-credit'][i].name.split(" ");
                    if (names.length === 3) {
                        newContributor = {
                            role: "Performer",
                            firstName: names[0],
                            lastName: names[1],
                            middleName: names[2],
                            suffix: ""
                        };
                    }
                    else {
                        newContributor = {
                            role: "Performer",
                            firstName: names[0],
                            lastName: names[1],
                            middleName: "",
                            suffix: ""
                        };
                    }
                }
                else {
                    newContributor = {
                        role: "Performer",
                        firstName: item['artist-credit'][i].name,
                        lastName: "",
                        middleName: "",
                        suffix: ""
                    };
                }
                contributors.push(newContributor);
            }
        }
        else {
            newContributor = {
                role: "Performer",
                firstName: "",
                lastName: "",
                middleName: "",
                suffix: ""
            };
            contributors.push(newContributor);
        }

        let publishedArray = [];
        let day = "";
        let month = "";
        let year = "";
        let monthInt = 0;
        //Splitting the publishedDate into month, year, day if appropriate
        if (item['first-release-date'].includes("-")){
            publishedArray = item['first-release-date'].split("-");
            year = publishedArray[0];
            monthInt = parseInt(publishedArray[1]);
            monthInt = monthInt - 1;
            month = monthInt.toString();
            day = publishedArray[2].replace("0", "");
        }
        else {
            month = "0";
            day = "1"
            year = item.volumeInfo.publishedDate;
        }

        let musicReference: any = {
            type: "song",
            title: item.title,
            image_url: "https://cdn4.picryl.com/photo/1881/01/01/erin-38c0d0-1024.jpg",
            contributors: contributors,
            publisher: "",
            volume: item.volume,
            month_published: month,
            day_published: day,
            year_published: year,
            urldate: new Date(),
        };

        HandleManualReference(musicReference, session?.user?.id)
        router.push("/reference-table");
        router.refresh();
        
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
                    <input type="search" id="default-search" value={searchVal} onChange={handleChange} className="block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Recording Title..." required />
                    <button type="submit" className="text-white absolute end-px bottom-0 right-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
            </form>
            {tableShown && (
                <table className="table-auto mt-4 border-solid">
                <thead className="bg-zinc-700 text-white">
                  <tr>
                    <th>Artists</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-100">
                            <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{item['artist-credit'].map((artist: { name: String; }) => artist.name).join(', ')}</td>
                            <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{item.title}</td>
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

export default InputCDDB;