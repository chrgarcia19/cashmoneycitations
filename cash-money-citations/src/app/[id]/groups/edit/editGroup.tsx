'use client'

import { CSLBibInterface } from "@/models/CSLBibTex";
import { Tab, Tabs } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import AddReferenceToGroup from "./addRefToGroup";
import RemoveReferenceFromGroup from "./removeRefFromGroup";

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
                <div className="flex justify-center items-center w-full flex-col pt-5">
                <Tabs aria-label="Tag Options" variant="solid">
                    <Tab key="add" title="Add References to Group">
                        <AddReferenceToGroup references={props.references} group={group} />
                    </Tab>
                    <Tab key="remove" title="Remove References from Group">
                        <RemoveReferenceFromGroup referenceIds={group.referenceId} />
                    </Tab>
                </Tabs>
                </div>            
        </>
    )
}