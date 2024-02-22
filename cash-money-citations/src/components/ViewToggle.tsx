"use client"

import ReferenceTable from "./ReferenceTable";
import ReferenceGallery from "./ReferenceGallery";
import { useState } from "react";
import dbConnect from "@/utils/dbConnect";
import Reference from "@/models/Reference";

async function getReferences() {
    await dbConnect();
  
    const result = await Reference.find({});
    const references = result.map((doc) => {
      const reference = JSON.parse(JSON.stringify(doc));
      return reference;
    });
  
    return references;
}

export const ViewToggle = async () => {
    const references = await getReferences();

    const [isToggled, setIsToggled] = useState(false);

    const toggleHandler = () => {
        setIsToggled(!isToggled);
    }

    return (
        <>
        <input 
            type="checkbox"
            className="toggle"
            id="checkbox"
            checked={isToggled}
            onChange={toggleHandler}
            />
            <div> {isToggled ? <ReferenceGallery /> : <ReferenceTable /> }</div> 
        </>
    )
    //<div> {isToggled ? <ReferenceGallery /> : <ReferenceTable /> }</div>  
   //<div> {isToggled ? "Toggle On" : "Toggle Off" }</div> 
}

export default ViewToggle;