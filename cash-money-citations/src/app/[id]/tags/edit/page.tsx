'use client'


import TagForm from "@/components/tagComponents/TagForm";
import { Card, CardFooter, CardHeader, Chip, Divider } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export default function EditTag(){

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
        <div className="flex justify-center items-center pt-5">
            <Card className="py-4 w-1/6">
                <CardHeader className="flex pb-0 pt-2 flex-col items-center">
                    <div className="join join-horizontal">
                        <h4 className="font-bold text-large">Edit Tag:</h4>
                        <Divider orientation="vertical" className="m-2"/>
                        <Chip
                            variant="flat"
                            className="bg-teal-200 me-2 mb-2">
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
        </>
    )
}