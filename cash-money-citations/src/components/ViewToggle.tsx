"use client"

import ReferenceTable from "./ReferenceTable";
import ReferenceGallery from "./ReferenceGallery";
import { useState } from "react";



export default function ViewToggle(){
    const [toggle, setToggle] = useState(false);

    return (
        <>
        <input type="checkbox" className="toggle"
             onClick={() => setToggle(!toggle)} /> 
         <div> {toggle ? <ReferenceGallery /> : <ReferenceTable /> }</div>     
        </>
    )
}