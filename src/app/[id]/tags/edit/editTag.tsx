'use client'


import TagForm from "@/app/tag-center/TagForm";
import { Card, CardFooter, CardHeader, Chip, Divider, Tab, Tabs } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import AddReferenceToTag from "./addRefToTag";
import { CSLBibInterface } from "@/models/CSLBibTex";
import RemoveReferenceFromTag from "./removeRefFromTag";

type Props = {
    references: CSLBibInterface[];
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export default function EditTag(props: Props){

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const {
        data: tag,
        error,
        isLoading,
    } = useSWR(id ? `/api/tags/${id}` : null, fetcher);

    if (error) return <p>Failed to load</p>;
    if (isLoading) return <p>Loading...</p>;
    if (!tag) return null;

    const tagForm = {
        tagName: tag.tagName,
        tagColor: tag.tagColor,
        referenceID: tag.referenceID
    };

    return (
        <>
            <h1 className="font-bold text-3xl flex items-center justify-center pt-10">Modify Tag - {tag.tagName}</h1>
            <div className="flex justify-center items-center w-full flex-col pt-5">
            <Tabs aria-label="Tag Options" variant="solid">
                <Tab key="edit" title="Edit Tag Name">
                    <div className="flex justify-center items-center pt-5">
                        <Card className="py-4">
                            <CardHeader className="flex pb-0 pt-2 flex-col items-center">
                                <div className="join join-horizontal">
                                    <h4 className="font-bold text-large">Edit Tag:</h4>
                                    <Divider orientation="vertical" className="m-2"/>
                                    <Chip
                                        variant="flat"
                                        className="bg-teal-200 me-2 mb-2 dark:text-black">
                                            {tag.tagName}     
                                    </Chip>
                                </div>
                            </CardHeader>
                            <Divider orientation="horizontal" className="my-1"/>
                            <CardFooter className="flex pb-0 pt-4 flex-col items-center">
                                <TagForm formID={"edit-tag"} tagForm={tagForm} forNewTag={false}/>
                            </CardFooter> 
                        </Card>
                    </div>
                </Tab>
                <Tab key="add" title="Add References to Tag">
                    <AddReferenceToTag references={props.references} tag={tag} />
                </Tab>
                <Tab key="remove" title="Remove References from Tag">
                    <RemoveReferenceFromTag referenceIds={tag.referenceId} tag={tag} />
                </Tab>
            </Tabs>
            </div> 
        </>
    )
}