"use client"

import React, { useState, useEffect } from "react";
import { FaRegListAlt } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@nextui-org/react";

type Props = {
    userReferenceCount: number;
}

const UserReferenceCounter = async (props: Props) => {
    const [referenceCount, setReferenceCount] = useState(0); 

    useEffect(() => {
        setReferenceCount(props.userReferenceCount);
     }, []); 
     

    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 flex flex-col items-center justify-center transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-green-800 hover:shadow-lg">
            <FaRegListAlt className="text-4xl text-blue-500 dark:text-blue-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Total References Added</h2>
                <>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{referenceCount}</p>
                    <Button className="mt-10 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                            color="primary"
                            size="lg"
                            as={Link}
                            href="/reference-table">
                                See All References
                    </Button>
                </>
        </div>
    );
};

export default UserReferenceCounter;
