'use client'
import { useRouter } from 'next/navigation';
import router from 'next/router';
import React, { startTransition, useEffect, useMemo, useState } from 'react';
import { GetCMCLogs, GetCollectionStats, GetDatabaseStatus, fetchDocumentsFromCollection } from '../adminActions';
import {Card, CardBody, CardHeader, CardFooter, Button, ButtonGroup} from '@nextui-org/react';
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/react";
import {Select, SelectSection, SelectItem} from "@nextui-org/react";
import { LogCMCError } from '@/components/componentActions/logActions';
import { BiEdit } from 'react-icons/bi';
import { DeleteIcon } from '@/app/reference-table/components/DeleteIcon';

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
    const [documentsPerPage,] = useState(20);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [fieldNames, setFieldNames] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        setCurrentPage(1);
    }, [collectionName])

    const editDocument = (docId: string, newDocData: any) => {
        // Implement your document editing logic here
    };

    const deleteDocument = async (docId: string) => {
        setIsLoading(true);
        let collection;
        switch(collectionName) {
          case "references":
            collection = `/references/${docId}`;
            break;
          case "citations":
            collection = `/citations/${docId}`;
            break;
          case "users":
            collection = `/auth/updateUser/${docId}`;
            break;
          case "tags":
            collection = `/tags/${docId}`;
            break;
          case "cslstyles":
            collection = `/csl/styles/${docId}`;
            break;
          case "locales":
            collection = `/csl/locales/${docId}`;
            break;
          case "logs":
            collection = `/logs/${docId}`;
            break;
        }

        const response = await fetch(`/api/${collection}`, {
            method: 'DELETE',
        });
    
        if (!response.ok) {
            setError(response.statusText)
            let e = `Failed to delete document with id ${docId} from collection ${collectionName}`;
            LogCMCError('CRITICAL', 'DATABASE', e);
            throw new Error(e);
        }
    
        // Update the local state to reflect the deletion
        setDocuments((prevDocuments) => prevDocuments.filter(doc => doc.id !== docId));
        setTotalDocuments((prevTotalDocuments) => prevTotalDocuments - 1);

        LogCMCError('SUCCESS', 'DATABASE', `Deleted document: ${docId} from collection: ${collectionName}`)
        setShowAlert(true);
        setIsLoading(false);

        setTimeout(() => {
            setShowAlert(false);
        }, 2000);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };



    return (
        <div className="flex flex-col items-center">
            {showAlert && (
                <div className="bg-red-500 text-white px-4 py-2 mb-4">
                    Document deleted.
                </div>
            )}
        <div className="flex-grow">
            {error}
            <div className='text-3xl font-mono text-center font-bold capitalize border-collapse border border-slate-200'>
                {collectionName}
            </div>
            <table className='table-auto border-collapse border border-slate-400'>
                <thead>
                    <tr>
                        {fieldNames.map((field) => (
                            <th className='font-mono border border-slate-300'>
                                {field.toLocaleUpperCase()}
                            </th>
                        ))}
                        <th className='font-mono border border-slate-300'>
                            ACTIONS
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {cachedDocuments.map((doc) => (
                        <tr key={doc.id}>
                            {fieldNames.map((field) => (
                                <td className='font-mono text-xs px-2 max-h-1 border border-slate-300'>
                                    {doc[field]}
                                </td>
                            ))}

                            <td className='border border-slate-300'>
                                <ButtonGroup>
                                    <Button isIconOnly size='sm' color='warning' onClick={() => editDocument(doc.id, {})}><BiEdit /></Button>
                                    <Button isLoading={isLoading} isIconOnly size='sm' color='danger' onClick={() => deleteDocument(doc.id)}><DeleteIcon /></Button>

                                </ButtonGroup>
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
        // Get the selected collection from local storage when the component mounts
        const storedSelectedKeys = localStorage.getItem('selectedKeys');
        if (storedSelectedKeys) {
            setSelectedKeys(new Set([storedSelectedKeys]));
        }
    }, []);

    useEffect(() => {
        const fetchCollStats = async() => {
            const stats = await GetCollectionStats(selectedValue);
            setCollStats(stats as CollectionStatisticObject);
        }

        fetchCollStats();
    }, [selectedValue])

    const handleSelectChange = (value: any) => {
        setSelectedKeys(new Set([value.target.value]))

        localStorage.setItem('selectedKeys', value.target.value);

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


