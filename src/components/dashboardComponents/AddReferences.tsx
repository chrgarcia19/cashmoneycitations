"use client"

import { Button, Link } from "@nextui-org/react";
import { EntryType } from "../Form";
import { HiOutlineDocumentAdd } from "react-icons/hi";

function countFormTypes() {
    const numberOfTypes = Object.values(EntryType).length; 
    return numberOfTypes; 
}

const AddReferences = () => {

    const numberOfTypes = countFormTypes();

    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 flex flex-col items-center justify-center transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-green-800 hover:shadow-lg">
            <HiOutlineDocumentAdd className="text-4xl text-blue-500 dark:text-blue-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Create References With</h2>
                <>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{numberOfTypes} Types</p>
                <Button className="mt-10 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    color="primary"
                    size="lg"
                    as={Link}
                    href="/new">
                        Add a New Reference
                </Button>
                </>
        </div>
    );
}

export default AddReferences;