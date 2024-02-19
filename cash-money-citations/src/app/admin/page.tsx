'use client'

import React from 'react';
import { useSession } from 'next-auth/react';

export default function AdminDashboard() {

    const { data: session, update } = useSession();
    
    const handleUpdateUser = async () => {
        const newSession = {
            ...session,
            user: {
                ...session?.user,
                role: "testuser"
            },
        }

        await update(newSession)
    }
    
    console.log("session", session);
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={handleUpdateUser}>Update Role For User</button>
        </div>
    );
};

// export default AdminDashboard;