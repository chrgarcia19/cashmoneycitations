'use client'

import { CSLBibInterface } from "@/models/CSLBibTex";
import { Tab, Tabs } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import AddReferenceToGroup from "./addRefToGroup";
import RemoveReferenceFromGroup from "./removeRefFromGroup";
import CreateCard from "@/app/group-center/createGroup";
import { getSpecificReferenceById } from "@/components/componentActions/actions";

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

    const groupData = {
        groupName: group.groupName,
        referenceId: group.referenceId,
    };

    const referenceArr = new Array<CSLBibInterface>();
    groupData.referenceId.map(async (id: any) => {
        const referenceData = await getSpecificReferenceById(id);
        referenceArr.push(referenceData);
    });

    return (
        <>  
            <h1 className="font-bold text-3xl flex items-center justify-center pt-10">Modify Group - {group.groupName}</h1>
                <div className="flex justify-center items-center w-full flex-col pt-5">
                <Tabs aria-label="Tag Options" variant="solid">
                    <Tab key="edit" title="Edit Group Name">
                        <CreateCard formId={"edit-group"} groupForm={groupData} forNewGroup={false} />
                    </Tab>
                    <Tab key="add" title="Add References to Group">
                        <AddReferenceToGroup references={props.references} group={group} />
                    </Tab>
                    <Tab key="remove" title="Remove References from Group">
                        <RemoveReferenceFromGroup refs={referenceArr} group={group} />
                    </Tab>
                </Tabs>
                </div>            
        </>
    )
}