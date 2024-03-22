import { Tag } from "@/models/Tag";
import { useEffect, useState } from "react";

interface IProps {
    tags: any;
}

export const TagTable = ({ tags }: IProps) => {
    const [refData, setRefData] = useState<Tag[]>([]);

    useEffect(() => {
        setRefData(tags);
    }, [refData]);
    
    const [isChecked, setIsChecked] = useState(
        new Array(tags.length).fill(false)
    );

    const checkHandler = (position: number) => {
        const checkState = isChecked.map((tag, i) => 
            i === position ? !tag : tag
        );

        setIsChecked(checkState)
    }

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
                            checked={isChecked[index]}
                            onChange={() => checkHandler(index)}
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