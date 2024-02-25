'use client'

import { useRouter } from 'next/navigation';
import { startTransition, useState, useTransition } from 'react';

export default function UserView(user: any) {
    const router = useRouter();
    const [isFetching, setIsFetching] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    function handleTextInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserEmail(e.target.value);
    }

    
    async function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsFetching(true);
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Add userEmail to the form data
        formData.append('userEmail', userEmail);
        
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
                    type='checkbox'
                    onChange={(e) => {
                        if (e.target.checked) {
                            setUserEmail(user.email);
                        } else {
                            setUserEmail('');
                        }
                    }}
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