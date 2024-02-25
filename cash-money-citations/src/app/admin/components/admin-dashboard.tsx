'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AdminDashboardClient() {
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();

    function handleTextInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserEmail(e.target.value);
    }

    
    function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Add userEmail to the form data
        formData.append('userEmail', userEmail);
        
        fetch('/api/auth/updateUser', { method: "PUT", body: formData });
        router.refresh()
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