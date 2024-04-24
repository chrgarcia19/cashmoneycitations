'use client';
import { Contributor } from "@/models/Contributor";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CreateCslJsonDocument, HandleManualReference } from "@/components/componentActions/citationActions";

interface InputISSNProps {
    searchVal: string;
    reload: boolean;
}

const InputISSN: React.FC<InputISSNProps> = ({ searchVal, reload }) =>  {
    const { data: session } = useSession();
    const [tableShown, setTableShown] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();
    const contentType = "application/json";
    const errorItem: any = [
        {
            DOI: "",
            ISSN: [
                "Enter a complete ISSN",
                "Enter a complete ISSN",
            ],
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
            const res = await fetch(`https://api.crossref.org/works?filter=issn:${searchVal}&rows=100`);
            const result = await res.json();
            if (result.message.items){
                setData(result.message.items);
            }
            else {
                setData(errorItem);
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

        //If item.author is populated, move forward on that, otherwise, handle the error appropriately
        if (item.author) {
            for (i; i<item.author.length; i++) {
                newContributor = {
                    role: "Author",
                    given: item.author[i].given,
                    family: item.author[i].family,
                    middle: "",
                    suffix: ""
                };
                contributors.push(newContributor);
            }
        }
        else {
            newContributor = {
                role: "Author",
                given: "",
                family: "",
                middle: "",
                suffix: ""
            };
            contributors.push(newContributor);
        }

        let day = "";
        let month = "";
        let year = "";
        let monthInt = 0;
        if (item.published['date-parts'][0].length === 3) {
            monthInt = parseInt(item.created['date-parts'][0][1].toString().replace("0", ""));
            monthInt = monthInt - 1;
            month = monthInt.toString();
            day = item.published['date-parts'][0][2].toString();
            year = item.published['date-parts'][0][0].toString();
        }
        else if (item.published['date-parts'][0].length === 2) {
            monthInt = parseInt(item.created['date-parts'][0][1].toString().replace("0", ""));
            monthInt = monthInt - 1;
            month = monthInt.toString();
            day = "1";
            year = item.published['date-parts'][0][0].toString();
        }
        else if (item.published['date-parts'][0].length === 1) {
            day = "1";
            month = "0";
            year = item.published['date-parts'][0][0].toString();
        }
        else { 
            month = "1";
            day = "1";
            year = "2000";
        }

        let issnReference: any = {
            type: "article-journal",
            title: item.title,
            "container-title": item["container-title"],
            image_url: "https://pbs.twimg.com/profile_images/592645671863328768/uv0v0EV8_400x400.jpg",
            URL: item.URL,
            contributors: contributors,
            publisher: item.publisher,
            volume: item.volume,
            issue: item.issue,
            monthPublished: month,
            dayPublished: day,
            yearPublished: year,
            DOI: item.DOI,
            ISSN: item.ISSN,
            issnType: item['issn-type'],
            "number-of-pages": item.page,
            abstract: item.abstract,
            language: item.language,
            subject: item.subject,
            apiSource: item.source
        };

        HandleManualReference(issnReference, session?.user?.id)
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
                                <th>Primary ISSN</th>
                                <th>Secondary ISSN</th>
                                <th>Title</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.DOI} className="border-b hover:bg-gray-100">
                                    <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{item.ISSN[0]}</td>
                                    <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{item.ISSN[1]}</td>
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

export default InputISSN;