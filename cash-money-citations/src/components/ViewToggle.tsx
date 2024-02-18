"use client"

import ReferenceTable from "./ReferenceTable";
import ReferenceGallery from "./ReferenceGallery";
import { useState } from "react";

const [toggle, setToggle] = useState(false);

export default async function ViewToggle(){
    return (
        <><input className="toggle"
            onClick={() => setToggle(!toggle)} />
        <div> {toggle ? <ReferenceTable /> : <ReferenceGallery /> }</div>
        </>
    )
}