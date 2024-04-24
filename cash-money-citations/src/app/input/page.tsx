'use client'

import InputDOI from "@/components/InputDOI";
import InputISBN from "@/components/InputISBN";
import InputISSN from "@/components/InputISSN";
import InputMusic from "@/components/InputMusic";
import { useState } from "react";

function Input () {
    const [searchVal, setSearchVal] = useState<string>("");
    const [inputType, setInputType] = useState<string>("");
    const [doi, setDOI] = useState<boolean>(false);
    const [isbn, setISBN] = useState<boolean>(false);
    const [issn, setISSN] = useState<boolean>(false);
    const [music, setMusic] = useState<boolean>(false);
    const [reloadNestedComponent, setReloadNestedComponent] = useState<boolean>(false);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchVal(value);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setInputType(value);
    };

    function determineInputType (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (reloadNestedComponent) {
            setReloadNestedComponent(false);
        }
        else {
            setReloadNestedComponent(true);
        }
        setDOI(false);
        setISBN(false);
        setISSN(false);
        setMusic(false);
        if (inputType === "doi") {
            setDOI(true);
        }
        else if (inputType === "isbn") {
            setISBN(true);
        }
        else if (inputType === "issn") {
            setISSN(true);
        }
        else if (inputType === "music") {
            setMusic(true);
        }
        else {
            alert("Please select an input type");
        }
    }

    return (
        <>
            <div className="flex flex-col mt-20">
                <form className="max-w-md mx-auto w-96" onSubmit={determineInputType}>
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute bottom-2 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <select value={inputType} onChange={handleTypeChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="" disabled>Select input type...</option>
                            <option value="doi">DOI</option>
                            <option value="isbn">ISBN</option>
                            <option value="issn">ISSN</option>
                            <option value="music">Music</option>
                        </select>
                        <input type="search" id="default-search" value={searchVal} onChange={handleSearchChange} className="mt-4 block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required />
                        <button type="submit" className="text-white absolute end-px bottom-0 right-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                </form>
                {doi && <InputDOI searchVal={searchVal} reload={reloadNestedComponent} />}
                {isbn && <InputISBN searchVal={searchVal} reload={reloadNestedComponent} />}
                {issn && <InputISSN searchVal={searchVal} reload={reloadNestedComponent} />}
                {music && <InputMusic searchVal={searchVal} reload={reloadNestedComponent} />}
            </div>
        </>
    )
}

export default Input;