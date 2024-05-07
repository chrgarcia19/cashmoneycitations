'use client'

import { useEffect, useState } from "react"
import { getSpecificTagById } from "./componentActions/tagActions";
import { Chip } from "@nextui-org/react";

type Props = {
    tagId: string;
}

const DisplayTags = async (props: Props) => {
    const [tag, setTags] = useState(Object);

    useEffect(() => {
        fetchTag();
      }, []);
    
    const fetchTag = async () => {    
        const tagData = await getSpecificTagById(props.tagId);  
        setTags(tagData);
    }

    return (
        <>
            <Chip
                variant="flat"
                className="bg-teal-200 me-2 mb-2 dark:text-black">
                    {tag.tagName}     
            </Chip>      
        </>
    )
}

export default DisplayTags;