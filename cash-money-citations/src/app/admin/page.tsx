'use client'

import React from 'react';
import { useSession } from 'next-auth/react';

export default function AdminDashboard() {

    const { data: session, update } = useSession();
    
    function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const userRoleSelect = formData.get('userRoleSelect');

        fetch('/api/auth/updateUser', { method: "PUT", body: formData})
        const newSession = {
            ...session,
            user: {
                ...session?.user,
                role: userRoleSelect
            },
        }

        update(newSession)
    }
    
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <form method='PUT' onSubmit={handleUpdateUser}>
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
    );
};

