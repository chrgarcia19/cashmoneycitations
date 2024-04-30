"use client"

import React, { useState, useEffect } from "react";
import { FaBookOpen } from "react-icons/fa";
import Link from "next/link";

const CitationStyleCounter = () => {
    const [citationStyleCount, setCitationStyleCount] = useState(2000);
    const [loading, setLoading] = useState(false);

    // // Simulate fetching citation style count
    // useEffect(() => {
    //     const fetchCitationStyles = async () => {
    //         setLoading(true);
    //         // Simulate a fetch request
    //         await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    //         setCitationStyleCount(2000); // Let's assume there are 2000 styles available
    //         setLoading(false);
    //     };

    //     fetchCitationStyles();
    // }, []);

    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 flex flex-col items-center justify-center transition duration-300 ease-in-out hover:bg-green-200 dark:hover:bg-green-800 hover:shadow-lg">
            <FaBookOpen className="text-4xl text-blue-500 dark:text-blue-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Citation Styles Available</h2>
            {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            ) : (
                <>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{citationStyleCount}</p>
                <Link href="">
                <button className="mt-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">See All Styles</button>
                </Link>
                </>
            )}
        </div>
    );
};

export default CitationStyleCounter;
