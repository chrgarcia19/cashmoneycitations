'use client'

import { useEffect, useState } from "react"
import { getSpecificGroupById } from "./componentActions/groupActions";
import { Chip } from "@nextui-org/react";

type Props = {
    groupId: string;
}

const DisplayGroups = async (props: Props) => {
    const [group, setGroup] = useState(Object);

    useEffect(() => {
        fetchGroup();
      }, []);
    
    const fetchGroup = async () => {    
        const groupData = await getSpecificGroupById(props.groupId);  
        setGroup(groupData);
    }

    return (
        <>
            <Chip 
                variant="flat"
                size="sm"
                className="bg-cyan-300 me-2 mb-2 dark:text-black">
                    {group.groupName}     
            </Chip>           
        </>
    )
}

export default DisplayGroups;