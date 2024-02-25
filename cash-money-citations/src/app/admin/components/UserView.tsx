'use client'

import { useRouter } from 'next/navigation';
import { startTransition, useState, useTransition } from 'react';

export default function UserView(user: any) {
    const router = useRouter();
    const [isFetching, setIsFetching] = useState(false);
    const [userEmail, setUserEmail] = useState<string[]>([]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, email: any) {
        if (e.target.checked) {
            setUserEmail([...userEmail, email]);
        } else {
            setUserEmail(userEmail.filter(uesrEmail => userEmail !== email));
        }
    }

    
    async function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsFetching(true);
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Add userEmail to the form data
        userEmail.forEach((email) => {
            formData.append(`userEmail`, email);
        })
        await fetch('/api/auth/updateUser', { method: "PUT", body: formData });
        setIsFetching(false);
        startTransition(() => {
            router.refresh();

        })
    }


    return (
    <>
        <tr>
            <td className='border border-slate-300'>
                {user.username}
            </td>
            <td className='border border-slate-300'>
                {user.role}
            </td>
            <td className='border border-slate-300'>
                {user.email}
            </td>
            <td className='border border-slate-300'>
                <ul>
                    {user.accounts.map((account: any) => (
                        <li key={account}>{account.provider}</li>
                    ))}
                </ul>
            </td>
            <td className='border border-slate-300'>
                <input
                    key={user._id}
                    type='checkbox'
                    onChange={(e) => handleChange(e, user.email)}
                />

                <form onSubmit={(event) => handleUpdateUser(event)}>
                    <select name='userRoleSelect' > 
                        <option value="user">
                            User
                        </option>
                        <option value="admin">
                            Admin
                        </option>
                    </select>
                    <button type='submit'>Submit</button>
                </form>

            </td>

        </tr>

        
    </>
    )
}