'use client';
import { Contributor } from "@/models/Contributor";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { HandleManualReference } from "@/components/componentActions/citationActions";

interface InputISBNProps {
    searchVal: string;
    reload: boolean;
}

const InputISBN: React.FC<InputISBNProps> = ({ searchVal, reload }) =>  {
    const { data: session } = useSession();
    const [tableShown, setTableShown] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();
    const [staticSearchVal, setStaticSearchVal] = useState<string>("");
    const errorItem: any = [
        {
            volumeInfo: {
                title: "Please insert a complete ISBN Number"
            }
        }
    ]

    // Fetch data when reload prop changes
    useEffect(() => {
        showResults();
    }, [reload]);

    function convertISBN13ToISBN10(isbn13: string): string {
        if (isbn13.includes(" ")) {
            for (let i = 0; i >= isbn13.split(" ").length - 1; i++) {
                isbn13 = isbn13.replace(/\s/g, "")
            }
        }
        let isbn9Digits = "";
        if (isbn13.includes("-")) {
            isbn9Digits = isbn13.slice(4, 13);
        }
        else {
            isbn9Digits = isbn13.slice(3, 12);
        }

        if (isbn13.length === 10) {
            return isbn13;
        }
        else {
            // Calculate the check digit for ISBN-10
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(isbn9Digits[i]) * (10 - i);
            }
            let checkDigit = ((11 - (sum % 11)) % 11).toString();
            if (checkDigit === "10") {
                checkDigit = "X";
            }
            const isbn10 = `${isbn9Digits}${checkDigit}`;
            return isbn10;
        }
        
    }
        

    async function showResults() {
        setStaticSearchVal("");
        let isbn = "";
        let finalSearchTerm = "";
        setTableShown(false);
        finalSearchTerm = searchVal;
        if (searchVal.length !== 10) {
            isbn = convertISBN13ToISBN10(searchVal);
            setStaticSearchVal(isbn);
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`);
            const result = await res.json();
            if (result.items) {
                setData(result.items);
                setStaticSearchVal(finalSearchTerm);
            }
            else {
                setData(errorItem);
            }
            setTableShown(true);
        }
        else {
            isbn = searchVal;
            setStaticSearchVal(isbn);
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${searchVal}&maxResults=1`);
            const result = await res.json();
            if (result.items) {
                setData(result.items);
                setStaticSearchVal(isbn);
            }
            else {
                setData(errorItem);
            }
            setTableShown(true);
        }
        
    }

    const addToDB = async (item: any) => {
        console.log(item)
        let i = 0;
        let authorArray = [];
        let newContributor: Contributor = {
            role: "",
            given: "",
            family: "",
            middle: "",
            suffix: ""
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
                    role: "Author",
                    given: firstName,
                    family: lastName,
                    middle: middleI,
                    suffix: ""
                };
                contributors.push(newContributor);
            }
        }
        else {
            newContributor = {
                role: "Author",
                given: "Unknown",
                family: "Unknown",
                middle: "",
                suffix: ""
            };
            contributors.push(newContributor);
        }
        let publishedArray = [];
        let year = "";
        let month = "";
        let day = "";
        let monthInt = 0;
        //Splitting the publishedDate into month, year, day if appropriate
        if (item.volumeInfo.publishedDate.includes("-")){
            publishedArray = item.volumeInfo.publishedDate.split("-");
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
        

        
        let isbnReference: any = {
            type: item.volumeInfo.printType.toLowerCase(),
            title: item.volumeInfo.title,
            contributors: contributors,
            publisher: publisher,
            yearPublished: year,
            dayPublished: day,
            monthPublished: month,
            "number-of-pages": item.volumeInfo.pageCount,
            ISBN: staticSearchVal,
            image_url: imageLink,
        };
        
        HandleManualReference(isbnReference, session?.user?.id)
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
                                <th>ISBN</th>
                                <th>Title</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={staticSearchVal} className="border-b hover:bg-gray-100">
                                    <td className="border-r border-b border-l border-zinc-500 py-2 px-2">{staticSearchVal}</td>
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