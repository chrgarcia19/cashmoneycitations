'use client'

import { useEffect, useState } from "react"
import { getSpecificGroupById } from "./componentActions/groupActions";

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
            <div className={`badge badge-lg bg-cyan-300 me-2`}>
                {group.groupName}           
            </div>            
        </>
    )
}

export default DisplayGroups;