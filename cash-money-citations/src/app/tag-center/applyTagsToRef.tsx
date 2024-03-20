'use client'

import { References } from "@/models/Reference";
import { Tag } from "@/models/Tag";
import { useEffect, useState } from "react";

interface IProps {
    tags: any;
    references: any;
}

interface TagData {
    tagID: string;
}

export const ApplyTagsToRef = ({ tags, references }: IProps) => {
    const [refData, setRefData] = useState<References[]>([]);

    useEffect(() => {
        setRefData(references);
    }, [refData]);
    
    const [isChecked, setIsChecked] = useState(
        new Array(references.length).fill(false)
    );

    const checkHandler = (position: number) => {
        const checkState = isChecked.map((reference, i) => 
            i === position ? !reference : reference
        );

        setIsChecked(checkState)
    }

    function getSelectedRefs(checked: Array<boolean>){
        let refs = new Array<References>();
        for (let i = 0; i < checked.length; i++){
            if (checked[i]){
                refs.push(refData[i]);
            }
        }
        
        return refs;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        
    }

    const handleAddTag = (refs: References[], tag: Tag) => {
        for (let i = 0; i < refs.length; i++){
            tag.referenceID.push(refs[i]._id);
            refs[i].tags.push(tag);
        }
        
        
    }

    return(
        <>
            <div className="card w-screen h-auto bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Apply Tags to References</h2>
                        <select 
                            className="select select-bordered select-sm w-full max-w-xs"
                            name="tagName">
                            <option value="" disabled selected>Select a Tag</option>
                            {tags.map((tag: any) => (
                            <option key={tag._id} value={tag._id}>
                                {tag.tagName}
                            </option> 
                            ))}
                            
                        </select>
                        <table className="table table-sm table-pin-rows table-pin-cols">
                            <thead>
                                <tr>
                                    <th className="border border-slate-800 text-black bg-sky-400">Select</th>
                                    <th className="border border-slate-800 text-black bg-sky-400">Reference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {references.map((reference: References, index: any) => (
                                    <tr className="bg-sky-100 hover:bg-zinc-400" key={reference._id}>
                                        <td className="border border-slate-600">
                                        <input 
                                            type="checkbox"
                                            className="checkbox checkbox-xs"
                                            name={`${reference.title}`}
                                            id={`ref-${index}`}
                                            checked={isChecked[index]}
                                            onChange={() => checkHandler(index)}
                                        />
                                        </td>
                                        <td className="border border-slate-600">
                                            {reference.title}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="card-actions justify-end">
                            <button 
                                className="btn btn-primary"
                                type="submit"
                                >
                                {/*handleAddTag(getSelectedRefs(isChecked), tag)*/}
                                Add to Reference</button>
                        </div>
                    </div>
                </div>
            </>
    )
}