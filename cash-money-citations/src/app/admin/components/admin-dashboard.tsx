'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';

export default function AdminDashboardClient() {
    const [userEmail, setUserEmail] = useState('');

    function handleTextInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserEmail(e.target.value);
    }

    const { data: session, update } = useSession();
    
    function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const userRoleSelect = formData.get('userRoleSelect');
        
        // Add userEmail to the form data
        formData.append('userEmail', userEmail);
        
        fetch('/api/auth/updateUser', { method: "PUT", body: formData });
        const newSession = {
            ...session,
            user: {
                ...session?.user,
                role: userRoleSelect
            },
        };

        update(newSession);
    }


    return (
        <>
        <div>
            <h1>Admin Dashboard</h1>
            <form method='PUT' onSubmit={handleUpdateUser}>
                <input type="text" value={userEmail} onChange={handleTextInputChange} placeholder="User Email"   className="input w-full max-w-xs" />

                <select name='userRoleSelect' > 
                    <option value="user">
                        User
                    </option>
                    <option value="admin">
                        Admin
                    </option>
                </select>
                <button type='submit' >Submit</button>

            </form>
        </div>
        </>
    );
};