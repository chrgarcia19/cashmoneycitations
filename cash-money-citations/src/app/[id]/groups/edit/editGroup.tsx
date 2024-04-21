'use client'

import { CSLBibInterface } from "@/models/CSLBibTex";
import { Card, CardHeader, Divider, CardBody, CardFooter, Chip, ChipProps, Selection, Button, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import AddReferenceToGroup from "./addRefToGroup";

type Props = {
    references: CSLBibInterface[];
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export default function EditGroup(props: Props){

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const {
        data: group,
        error,
        isLoading,
    } = useSWR(id ? `/api/groups/${id}` : null, fetcher);

    if (error) return <p>Failed to load</p>;
    if (isLoading) return <p>Loading...</p>;
    if (!group) return null;

    return (
        <>  
            <h1 className="font-bold text-3xl flex items-center justify-center pt-10">Modify Group - {group.groupName}</h1>
            <div className="flex items-center justify-center pt-5">
                
                <div className="flex gap-14">
                    <Card>
                        <CardHeader className="flex gap-3">
                            <h4 className="font-bold">Add References to Group</h4>
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                            <AddReferenceToGroup formId={"add-reference-to-group"} references={props.references} />
                        </CardBody>
                        <Divider/>
                        <CardFooter>
                            
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader className="flex gap-3">
                            <h4 className="font-bold">Remove References to Group</h4>
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                            
                        </CardBody>
                        <Divider/>
                        <CardFooter>
                            
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    )
}