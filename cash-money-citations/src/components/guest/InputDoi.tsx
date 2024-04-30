'use client';
import { Contributor } from "@/models/Contributor";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HandleManualReference } from "@/components/componentActions/citationActions";
import { useSession } from "next-auth/react";


interface InputDOIProps {
    searchVal: string;
    reload: boolean;
}

const InputDOI: React.FC<InputDOIProps> = ({ searchVal, reload }) => {
    const { data: session } = useSession();
    const [tableShown, setTableShown] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();
    const errorItem: any = [
        {
            DOI: "Please enter a complete DOI",
            title: "Unknown"
        }
    ]

    // Fetch data when reload prop changes
    useEffect(() => {
        showResults();
    }, [reload]);

    async function showResults() {
        setTableShown(false);
        const res = await fetch(`https://api.crossref.org/works?filter=doi:${searchVal}&rows=100`);
        const result = await res.json();
        if (result.message.items){
            setData(result.message.items);
        }
        else {
            setData(errorItem)
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

        // Loop through each contributor type
        const contributorTypes = ['author', 'editor', 'translator', 'compiler'];
        for (const type of contributorTypes) {
            if (item[type]) {
            for (i; i < item[type].length; i++) {
                newContributor = {
                role: type.charAt(0).toUpperCase() + type.slice(1),
                given: item[type][i].given,
                family: item[type][i].family,
                middle: "",
                suffix: ""
                };
                contributors.push(newContributor);
            }
            }
        }

        let day = "";
        let month = "";
        let year = "";
        let monthInt = 0;
        if (item['published']['date-parts'][0].length === 3) {
            monthInt = parseInt(item['published']['date-parts'][0][1].toString());
            monthInt = monthInt - 1;
            month = monthInt.toString();
            day = item['published']['date-parts'][0][2].toString();
            year = item['published']['date-parts'][0][0].toString();
        }
        else if (item['published']['date-parts'][0].length === 2) {
            monthInt = parseInt(item['published']['date-parts'][0][1].toString());
            monthInt = monthInt - 1;
            month = monthInt.toString();
            day = "1";
            year = item['published']['date-parts'][0][0].toString();
        }
        else if (item['published']['date-parts'][0].length === 1) {
            day = "1";
            month = "0";
            year = item['published']['date-parts'][0][0].toString();
        }
        else { 
            month = "1";
            day = "1";
            year = "2000";
        }

        // NEED TO ADD THE REST OF THE DATE FIELDS
        let doiReference: any = {
            type: "article-journal",
            title: item.title,
            "container-title": item['container-title'],
            image_url: "https://www.arnold-bergstraesser.de/sites/default/files/styles/placeholder_image/public/2023-11/abi-publication-placeholder-journal-article.jpg?h=10d202d3&itok=_uhYkrvi",
            contributors: contributors,
            publisher: item.publisher,
            volume: item.volume,
            monthPublished: month,
            dayPublished: day,
            yearPublished: year,
            URL: item.URL,
            issue: item.issue,
            DOI: item.DOI,
            ISSN: item.ISSN,
            issnType: item['issn-type'],
            "number-of-pages": item.page,
            abstract: item.abstract,
            apiSource: item.source
        };

        let storedReferences = localStorage.getItem('guestReferences');
        let references = storedReferences ? JSON.parse(storedReferences) : [];
        references.push(doiReference);
        localStorage.setItem('guestReferences', JSON.stringify(references));
        router.push("/guest/referenceTable");
        router.refresh();
    }

    return (
        <>
            <div className="flex flex-col items-center">
            {tableShown && (
                <table className="table-auto mt-4 border-solid">
                <thead className="bg-zinc-700 text-white">
                  <tr>
                    <th>DOI</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.DOI} className="border-b hover:bg-gray-100">
                            <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{item.DOI}</td>
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

export default InputDOI;