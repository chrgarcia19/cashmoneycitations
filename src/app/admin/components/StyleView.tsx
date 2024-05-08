'use client'

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

export function CslStyleView(style: any) {
    const router = useRouter();
    const [styleName, setStyleName] = useState<string[]>([]);
    
    async function handleDeleteStyle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Add userEmail to the form data
        styleName.forEach((style) => {
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


export function CslLocaleView(locale: any) {
    const router = useRouter();
    const [localeName, setLocaleName] = useState<string[]>([]);
    
    async function handleDeleteStyle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Add userEmail to the form data
        localeName.forEach((locale) => {
            formData.append(`name`, locale);
        })
        await fetch('/api/csl/locales', { method: "DELETE", body: formData });
        startTransition(() => {
            router.refresh();

        })
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, locale: any) {
        if (e.target.checked) {
            setLocaleName(localeName => [...localeName, locale]);
        } else {
            setLocaleName(localeName => localeName.filter(localeName => localeName !== locale));
        }
    }

    return (
        <>
            <tr>
                <td>
                    {locale.name}
                    <form onSubmit={(event) => handleDeleteStyle(event)}>
                    <input
                    value={locale.name}
                    type='checkbox'
                    checked={localeName.includes(locale.name)}
                    onChange={(e) => handleChange(e, locale.name)}
                    />
                        <button type='submit'>Delete</button>
                    </form>    
                    
                </td>
            </tr>
        </>
    )
}