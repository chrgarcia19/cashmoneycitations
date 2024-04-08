'use client'

import { useEffect, useState } from "react"
import { getSpecificTagById, getUserTags } from "./componentActions/tagActions";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

type Props = {
    tagId: string;
}

const DisplayTags = async (props: Props) => {
    const [tags, setTags] = useState(Object);

    useEffect(() => {
        fetchTag();
      }, []);
    
    const fetchTag = async () => {    
        const tagData = await getSpecificTagById(props.tagId);  
        setTags(tagData);
    }

    return (
        <>
            <div className={`badge badge-lg bg-teal-200 me-2`}>
                {tags.tagName}           
            </div>            
        </>
    )
}

export default DisplayTags;