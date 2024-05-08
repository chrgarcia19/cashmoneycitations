"use client"

import React, { useState, useEffect } from "react";
import { FaBookOpen } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@nextui-org/react";

type Props = {
    styleCount: number | never[];
}

const CitationStyleCounter = (props: Props) => {
    const [citationStyleCount, setCitationStyleCount] = useState<number | never[]>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCitationStyleCount(props.styleCount)
     }, []); 

    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 flex flex-col items-center justify-center transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-green-800 hover:shadow-lg">
            <FaBookOpen className="text-4xl text-blue-500 dark:text-blue-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Citation Styles Available</h2>
            <>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{citationStyleCount}</p>
            <Button className="mt-10 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    color="primary"
                    size="lg"
                    as={Link}
                    href="https://github.com/citation-style-language/styles">
                        See All Styles
            </Button>
            </>
        </div>
    );
};

export default CitationStyleCounter;
