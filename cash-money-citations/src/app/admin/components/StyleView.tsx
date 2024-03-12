'use client'

import router, { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

export default function StyleView(style: any) {
    const router = useRouter();
    const [styleName, setStyleName] = useState<string[]>([]);
    
    async function handleDeleteStyle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Add userEmail to the form data
        styleName.forEach((style) => {
            console.log(style)
            formData.append(`name`, style);
        })
        await fetch('/api/csl/styles', { method: "DELETE", body: formData });
        startTransition(() => {
            router.refresh();

        })
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, style: any) {
        if (e.target.checked) {
            setStyleName(styleName => [...styleName, style]);
        } else {
            setStyleName(styleName => styleName.filter(styleName => styleName !== style));
        }
    }

    return (
        <>
            <tr>
                <td>
                    {style.name}
                    <form onSubmit={(event) => handleDeleteStyle(event)}>
                    <input
                    value={style.name}
                    type='checkbox'
                    checked={styleName.includes(style.name)}
                    onChange={(e) => handleChange(e, style.name)}
                    />
                        <button type='submit'>Delete</button>
                    </form>    
                    
                </td>
            </tr>
        </>
    )
}