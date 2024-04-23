'use client';
import { Contributor } from "@/models/Contributor";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CreateCslJsonDocument, HandleManualReference } from "@/components/componentActions/citationActions";
import { useSession } from "next-auth/react";

interface InputMusicProps {
    searchVal: string;
    reload: boolean;
}

const InputMusic: React.FC<InputMusicProps> = ({ searchVal, reload }) => {
    const { data: session } = useSession();
    const [tableShown, setTableShown] = useState<boolean>(false);
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

    // Fetch data when reload prop changes
    useEffect(() => {
        showResults();
    }, [reload]);

    async function showResults() {
        setTableShown(false);
        try {
            const res = await fetch(`https://musicbrainz.org/ws/2/recording/?query=title:${searchVal}&fmt=json`);
            const result = await res.json();
            if (result.recordings && result.recordings.length !== 0){
                setData(result.recordings);
            }
            else {
                setData(errorItem)
            }
        }
        catch {
            setData(errorItem);
        }
        setTableShown(true);
    }

    const addToDB = async (item: any) => {
        
        let i = 0;
        let newContributor: Contributor = {
            role: "",
            given: "",
            family: "",
            middle: "",
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
                            given: names[0],
                            family: names[1],
                            middle: names[2],
                            suffix: ""
                        };
                    }
                    else {
                        newContributor = {
                            role: "Performer",
                            given: names[0],
                            family: names[1],
                            middle: "",
                            suffix: ""
                        };
                    }
                }
                else {
                    newContributor = {
                        role: "Performer",
                        given: item['artist-credit'][i].name,
                        family: "",
                        middle: "",
                        suffix: ""
                    };
                }
                contributors.push(newContributor);
            }
        }
        else {
            newContributor = {
                role: "Performer",
                given: "",
                family: "",
                middle: "",
                suffix: ""
            };
            contributors.push(newContributor);
        }

        let publishedArray = [];
        let day = "";
        let month = "";
        let year = "";
        let monthInt = 0;
        //Splitting the release date into month, year, day if appropriate
        if (item['first-release-date']){
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
                day = "1";
                year = item['first-release-date'];
            }
        }
        else {
            month = "0";
            day = "1";
            year = "0";
        }
        

        let musicReference: any = {
            type: "song",
            title: item.title,
            image_url: "https://cdn4.picryl.com/photo/1881/01/01/erin-38c0d0-1024.jpg",
            contributors: contributors,
            publisher: "",
            volume: item.volume,
            monthPublished: month,
            dayPublished: day,
            yearPublished: year,
            urldate: new Date(),
        };

        HandleManualReference(musicReference, session?.user?.id)
        router.push("/reference-table");
        router.refresh();
        
    }

    return (
        <>
            <div className="flex flex-col items-center">
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

export default InputMusic;