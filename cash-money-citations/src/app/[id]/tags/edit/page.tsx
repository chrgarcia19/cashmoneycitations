'use client'

import TagForm from "@/components/TagForm";
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
        <div className="center-content">
            <div className="card w-1/2 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Edit Tag</h2>
                        <TagForm formID={"edit-tag"} tagForm={tagForm} forNewTag={false}/>
                </div>
            </div>
        </div>
    )
}