'use client'
import { useRouter } from 'next/navigation';
import router from 'next/router';
import React, { startTransition, useEffect, useMemo, useState } from 'react';
import { GetCMCLogs, GetCollectionStats, GetDatabaseStatus, fetchDocumentsFromCollection } from '../adminActions';
import {Card, CardBody, CardHeader, CardFooter, Button} from '@nextui-org/react';
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/react";
import {Select, SelectSection, SelectItem} from "@nextui-org/react";
import { LogCMCError } from '@/components/componentActions/logActions';

export default function AdminDashboardClient() {
    const [userEmail, setUserEmail] = useState<string[]>([]);
    const router = useRouter();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, email: any) {
        if (e.target.checked) {
            setUserEmail([...userEmail, email]);
        } else {
            setUserEmail(userEmail.filter(uesrEmail => userEmail !== email));
        }
    }

    
    async function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Add userEmail to the form data
        userEmail.forEach((email) => {
            formData.append(`userEmail`, email);
        })
        await fetch('/api/auth/updateUser', { method: "PUT", body: formData });
        startTransition(() => {
            router.refresh();

        })
    }


    return (
        <>
        <div>
            <h1>Admin Dashboard</h1>
            <form method='PUT' onSubmit={handleUpdateUser}>

                <select name='userRoleSelect' > 
                    <option value="user">
                        User
                    </option>
                    <option value="admin">
                        Admin
                    </option>
                </select>
                <button type='submit' >Submit</button>

            </form>
        </div>
        </>
    );
};

type CollectionStatisticObject = {
    ns: { label: string, value: string} // Namespace
    localTime: { label: string, value: Date }
    size: { label: string, value: number }
    avgObjSize: { label: string, value: number }
    storageSize: { label: string, value: number }
    freeStorageSize: { label: string, value: number }
    totalSize: { label: string, value: number }
    count: { label: string, value: number } // Amount of documents in collection
}

export const ManageCollectionDocuments = ({ collectionName }: { collectionName: string }) => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [documentsPerPage,] = useState(10);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [fieldNames, setFieldNames] = useState<string[]>([]);

    const totalPages = Math.ceil(totalDocuments / documentsPerPage);
    const cachedDocuments = useMemo(() => documents, [documents]);

    useEffect(() => {
        const fetchDocuments = async () => {
            const response = await fetchDocumentsFromCollection(collectionName, currentPage, documentsPerPage);
            if (response) {
                const { documents, totalDocuments, fieldNames } = response;
                setDocuments(documents as string[]);
                setTotalDocuments(totalDocuments);
                setFieldNames(fieldNames as string[]);
            }
        };

        fetchDocuments();
    }, [collectionName, currentPage]);

    const editDocument = (docId: string, newDocData: any) => {
        // Implement your document editing logic here
    };

    const deleteDocument = (docId: string) => {
        // Implement your document deletion logic here
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="flex flex-col items-center">
        <div className="flex-grow">
            <table>
                <thead>
                    <tr>
                        {fieldNames.map((field) => (
                            <th>
                                {field.toLocaleUpperCase()}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {cachedDocuments.map((doc) => (
                        <tr key={doc.id}>
                            {fieldNames.map((field) => (
                                <td className='font-mono text-sm'>
                                    {doc[field]}
                                </td>
                            ))}

                            <td>
                                <Button onClick={() => editDocument(doc.id, {})}>Edit</Button>
                                <Button onClick={() => deleteDocument(doc.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}

                </tbody>

            </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      </div>
    );
};

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
  };

  const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, handlePageChange }) => {
    return (
      <div className="flex justify-center my-4">
        <button
          className={`px-4 py-2 mx-1 rounded bg-blue-500 text-white ${
            currentPage === 1 && 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1">
          Page <span className="font-bold">{currentPage}</span>
        </span>
        <button
            className={`px-4 py-2 mx-1 rounded bg-blue-500 text-white ${
            currentPage === totalPages && 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            Next
        </button>
      </div>
    );
};

export const DisplayCollectionStatistics = () => {
    const [collStats, setCollStats] = useState<CollectionStatisticObject | {}>({});
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["references"]));

    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
      [selectedKeys]
    );

    useEffect(() => {
        const fetchCollStats = async() => {
            const stats = await GetCollectionStats(selectedValue);
            setCollStats(stats as CollectionStatisticObject);
        }

        fetchCollStats();
    }, [selectedValue])

    const handleSelectChange = (value: any) => {
        setSelectedKeys(new Set([value.target.value]))
    }


    return (
        <div>
            <Card className='flex flex-col items-center justify-center'>
            <CardHeader className='w-full text-center justify-between items-center'>
                <h2 className='text-lg '>Database Collection Information</h2>
                    <Select size='sm' className='max-w-xs' onChange={handleSelectChange}>
                        <SelectItem key={"citations"}>
                            Citations
                        </SelectItem>
                        <SelectItem key={"logs"}>
                            Logs
                        </SelectItem>
                        <SelectItem key={"users"}>
                            Users
                        </SelectItem>
                        <SelectItem key={"references"}>
                            References
                        </SelectItem>
                        <SelectItem key={"locales"}>
                            Locales
                        </SelectItem>
                        <SelectItem key={"cslstyles"}>
                            CSL Styles
                        </SelectItem>
                        <SelectItem key={"tags"}>
                            tags
                        </SelectItem>
                    </Select>
                <div className='flex'>
                </div>
            </CardHeader>

            <CardBody className='w-full'>
                <div>
                <Table className='mx-auto'>
                    <TableHeader>
                    <TableColumn>Field</TableColumn>
                    <TableColumn>Value</TableColumn>
                    </TableHeader>
                    <TableBody>
                    {Object.entries(collStats).map(([key, value]) => (
                        <TableRow key={key}>
                        <TableCell>{value.label}</TableCell>
                        <TableCell>{String(value.value)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
            </CardBody>
            <CardFooter className="h-120 flex items-center justify-center border-t border-gray-200">
                <ManageCollectionDocuments collectionName={selectedValue} />
            </CardFooter>
            </Card>
        </div>
    )

}

type DBStatisticObject = {
    db: string,
    objects: number,
    indexes: number,
    totalSize: number,
}

export const DisplayServerStatistics = () => {
    const [serverStats, setServerStats] = useState<DBStatisticObject | {}>({});
    const [serverStatus, setServerStatus] = useState(false);

    useEffect(() => {
      const fetchServerStats = async () => {
        const stats = await GetDatabaseStatus();
        if (stats) {
            setServerStatus(true);
        }
        setServerStats(stats);
      };
  
      fetchServerStats();
    }, []);
  
    if (!serverStats) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="px-2 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-12 lg:px-4 lg:py-8">
        <h6 className="grid grid-cols-2 row-gap-8 md:grid-cols-5">
            <div className='text-center'>
                {serverStatus ?
                    <h6 className='text-xl font-bold text-deep-purple-accent-400' >
                        <p className='font-bold'>Database is online.</p>
                    </h6>
                :
                    <h6 className='text-xl font-bold text-deep-purple-accent-400'>
                        Main database is offline.
                    </h6>
                }

            </div>
        <div className="text-center">
            <h6 className="text-3xl font-bold text-deep-purple-accent-400">
                {(serverStats as DBStatisticObject).db}
            </h6>
            <p className="font-bold">Current Database</p>
        </div>
          <div className="text-center">
            <h6 className="text-3xl font-bold text-deep-purple-accent-400">
              {(serverStats as DBStatisticObject).objects}
            </h6>
            <p className="font-bold">Total Objects</p>
          </div>
          <div className="text-center">
            <h6 className="text-3xl font-bold text-deep-purple-accent-400">
              {(serverStats as DBStatisticObject).indexes}
            </h6>
            <p className="font-bold">Indexes</p>
          </div>
          <div className="text-center">
            <h6 className="text-3xl font-bold text-deep-purple-accent-400">
              {(serverStats as DBStatisticObject).totalSize}
            </h6>
            <p className="font-bold">Total Database size</p>
          </div>
        </h6>
      </div>
    );
};


export const DisplayCMCLogs = () => {
    const [logs, setLogs] = useState<any[]>([]);

    // Simulate fetching logs
    useEffect(() => {
        const fetchLogs = async () => {
            // Replace this with actual API call
            const fetchedLogs = await GetCMCLogs();
            if (fetchedLogs) {
                setLogs(fetchedLogs);
            } else {
                LogCMCError("WARNING", "DATABASE", `Failed to retrieve logs. Date: ${Date.now()}`)
                console.error('Failed to retrieve logs.');
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="overflow-auto max-h-96 mt-8 mb-8">
            <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Log Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Log Body
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Created
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 text-sm whitespace-wrap">
                                {log.logType}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-wrap">
                                {log.priority}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-wrap">
                                {log.data}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-wrap">
                                {log.createdAt}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};