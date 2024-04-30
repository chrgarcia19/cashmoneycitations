"use client"

import React, { useState, useEffect } from "react";
import { FaRegListAlt } from "react-icons/fa";
import Link from "next/link";

const UserReferenceCounter = () => {
    const [referenceCount, setReferenceCount] = useState(143);
    const [loading, setLoading] = useState(false);

    // Simulate fetching reference count from local storage or a backend
    // useEffect(() => {
    //     const fetchReferences = async () => {
    //         setLoading(true);
    //         // Simulate a fetch request with a delay
    //         await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    //         // Let's assume the user has 150 references stored
    //         setReferenceCount(150); // This would be fetched from a real database or local storage
    //         setLoading(false);
    //     };

    //     fetchReferences();
    // }, []);

    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 flex flex-col items-center justify-center transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-green-800 hover:shadow-lg">
            <FaRegListAlt className="text-4xl text-blue-500 dark:text-blue-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Total References Added</h2>
            {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            ) : (
                <>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{referenceCount}</p>
                <Link href="/reference-table">
                <button className="mt-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">See All references</button>
                </Link>
                </>
                
            )}
        </div>
    );
};

export default UserReferenceCounter;
