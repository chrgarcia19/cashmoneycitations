'use client'

import { useEffect, useState } from "react";
import { getSpecificReferenceById } from "../componentActions/actions";


type Props = {
    referenceId: any;
}

const ViewReference = (props: Props) => {
    
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

export default ViewReference;