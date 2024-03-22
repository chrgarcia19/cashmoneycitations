import { References } from "@/models/Reference";
import { useEffect, useState } from "react";

interface IProps {
    references: any;
}

export const TagRefTable = ({ references }: IProps) => {
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
    )
}