'use client'

import { References } from "@/models/Reference";
import { Tag } from "@/models/Tag";
import { TagRefTable } from "./TagRefTable";
import { TagTable } from "./TagTable";
import { useEffect, useState } from "react";
import applyReferencesToTag, { applyTagsToReference } from "./tagActions";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";

interface IProps {
    tags: any;
    references: any;
}

export const ApplyTagsToRef = ({ tags, references }: IProps) => {
  const router = useRouter();
  const [refData, setRefData] = useState<References[]>([]);

  useEffect(() => {
    setRefData(references);
  }, [refData]);

  const [isCheckedRef, setIsCheckedRef] = useState(
    new Array(references.length).fill(false)
  );

  const refCheckHandler = (position: number) => {
    const checkState = isCheckedRef.map((reference, i) => 
      i === position ? !reference : reference
    );

    setIsCheckedRef(checkState);
  }
    
  const [tagData, setTagData] = useState<Tag[]>([]);

  useEffect(() => {
    setTagData(tags);
  }, [tagData]);

  const [isCheckedTag, setIsCheckedTag] = useState(
    new Array(tags.length).fill(false)
  );

  const tagCheckHandler = (position: number) => {
    const checkState = isCheckedTag.map((tag, i) => 
      i === position ? !tag : tag
    );

    setIsCheckedTag(checkState);
  }

  function tagTable(){
    return (
        <table className="table table-sm table-pin-rows table-pin-cols">
            <thead>
                <tr>
                    <th className="border border-slate-800 text-black bg-green-400">Select</th>
                    <th className="border border-slate-800 text-black bg-green-400">Tag</th>
                </tr>
            </thead>
            <tbody>
                {tags.map((tag: Tag, index: any) => (
                    <tr className="bg-green-100 hover:bg-zinc-400" key={tag._id}>
                        <td className="border border-slate-600">
                        <input 
                            type="checkbox"
                            className="checkbox checkbox-xs"
                            name={`${tag.tagName}`}
                            id={`ref-${index}`}
                            checked={isCheckedTag[index]}
                            onChange={() => tagCheckHandler(index)}
                        />
                        </td>
                        <td className="border border-slate-600">
                            {tag.tagName}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
  }

  function refTable(){
    return (
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
                            checked={isCheckedRef[index]}
                            onChange={() => refCheckHandler(index)}
                        />
                        </td>
                        <td className="border border-slate-600">
                            {reference.title}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
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

  function getSelectedTags(checked: Array<boolean>){
    let tags = new Array<Tag>();
    for (let i = 0; i < checked.length; i++){
        if (checked[i]){
            tags.push(tagData[i]);
        }
    }
    
    return tags;
  }

    /*Logic works*/
    const handleAddTag = (refs: References[], tags: Tag[]) => {
        let currentRef, currentTag;
        /*Adding all selected tags to each ref*/  
        for (let i = 0; i < refs.length; i++){
            currentRef = refs[i];
            for (let j = 0; j < tags.length; j++){
                currentRef.tagID.push(tags[j]._id);
            }
            refs[i] = currentRef;
            //tag.referenceID.push(refs[i]._id);
            //refs[i].tags.push(tag);
        }
        /*Adding all selected refs to each tag*/  
        for (let i = 0; i < tags.length; i++){
            currentTag = tags[i];
            for (let j = 0; j < refs.length; j++){
                currentTag.referenceID.push(refs[j]._id);
            }
            tags[i] = currentTag;
            //tag.referenceID.push(refs[i]._id);
            //refs[i].tags.push(tag);
        }
        console.log("Refs: " + JSON.stringify(refs) + "\n\n");
        console.log("Tags: " + JSON.stringify(tags) + "\n\n"); 
    }

    async function testAdd(refChecked: Array<boolean>, tagChecked: Array<boolean>){
      const refs = getSelectedRefs(refChecked);
      const tags = getSelectedTags(tagChecked);
      /*Add Tag IDs to References first*/
      for (let i = 0; i < tags.length; i++){
        await applyTagsToReference(refs[i], tags);
      }
      /*Add Reference IDs to Tags*/
      for (let i = 0; i < refs.length; i++){
        await applyReferencesToTag(tags[i], refs);
      }
      router.push("/tag-center");
      router.refresh();
    }

    return(
        <>
            <div className="card w-screen h-auto bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Apply Tags to References</h2>
                        <form onSubmit={() => testAdd(isCheckedRef, isCheckedTag)}>
                            {tagTable()}
                            {refTable()}
                            <div className="card-actions justify-end">
                                <button 
                                    className="btn btn-primary"
                                    type="submit"
                                    >
                                    Add to Reference</button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
    )
}