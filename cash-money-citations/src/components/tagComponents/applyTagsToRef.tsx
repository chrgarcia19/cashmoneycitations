'use client'

import { CSLBibInterface } from "@/models/CSLBibTex";
import { Tag } from "@/models/Tag";
import { useEffect, useState } from "react";
import {  applyReferencesToTag, applyTagsToReference } from "../../app/tag-center/tagActions";
import { useRouter } from "next/navigation";
import {Card, CardHeader, CardBody, Divider, Chip} from "@nextui-org/react";

interface IProps {
    tags: any;
    references: any;
}

export const ApplyTagsToRef = ({ tags, references }: IProps) => {
    const router = useRouter();
    const [refData, setRefData] = useState<CSLBibInterface[]>([]);

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
            <table className="table table-xs table-pin-rows table-pin-cols">
                <thead>
                    <tr>
                        <th className="border border-slate-800 text-black bg-green-400">Select</th>
                        <th className="border border-slate-800 text-black bg-green-400">Tag</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.map((tag: Tag, index: any) => (
                        <tr className="bg-green-100 hover:bg-zinc-400 " key={tag._id}>
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
                            <td className="border border-slate-600 dark:text-black">
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
            <table className="table table-xs table-pin-rows table-pin-cols">
                <thead>
                    <tr>
                        <th className="border border-slate-800 text-black bg-sky-400">Select</th>
                        <th className="border border-slate-800 text-black bg-sky-400">Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {references.map((reference: CSLBibInterface, index: any) => (
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
                            <td className="border border-slate-600 dark:text-black">
                                {reference.title}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    function getSelectedRefs(checked: Array<boolean>){
        let refs = new Array<CSLBibInterface>();
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

    async function handleSubmit(refChecked: Array<boolean>, tagChecked: Array<boolean>, e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        const refs = getSelectedRefs(refChecked);
        const tags = getSelectedTags(tagChecked);

        /*Add Tag IDs to References first*/
        for (let i = 0; i < refs.length; i++){
            await applyTagsToReference(refs[i], tags);
        }
        /*Add Reference IDs to Tags*/
        for (let i = 0; i < tags.length; i++){
            await applyReferencesToTag(tags[i], refs);
        }
        router.push("/");
        router.refresh();
    }

    return(
        <>
            <div className="flex justify-center items-center">
                <Card className="py-4 w-3/4">
                    <CardHeader className="flex pb-0 pt-2 flex-col items-center">
                        <h4 className="font-bold text-large">Add Tags to References</h4>   
                    </CardHeader> 
                    <Divider orientation="horizontal" className="my-1"/>
                    <CardBody className="overflow-visible py-2">
                    <form id="assign_tag" onSubmit={async (e) => await handleSubmit(isCheckedRef, isCheckedTag, e)}>
                        <div className="join join-horizontal">
                            {tagTable()}
                            {refTable()}
                        </div>
                        <div className="card-actions justify-end">
                            <button 
                                className="btn btn-primary"
                                type="submit"
                                >
                                Add to Reference</button>
                        </div>
                    </form>
                    </CardBody>   
                </Card>
            </div>
        </>
    )
}