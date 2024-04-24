'use client'

import { getSpecificReferenceById } from "@/components/componentActions/actions";
import { useEffect, useState } from "react";

type Props = {
    referenceId: any;
}

const ViewGroupReferences = (props: Props) => {
    
    const [references, setReferences] = useState(Object);

    useEffect(() => {
        fetchReferences();
      }, []);
    
    const fetchReferences = async () => {    
        const referenceData = await getSpecificReferenceById(props.referenceId);  
        setReferences(referenceData);
    }

    return (
        <>
           <div>{references.title}</div>
        </>
    );
}

export default ViewGroupReferences;