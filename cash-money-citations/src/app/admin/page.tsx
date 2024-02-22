import React from 'react';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import AdminDashboardClient from './components/admin-dashboard';

export default async function AdminDashboard() {

    async function getUsers() {
        await dbConnect();
      
        const result = await User.find({});
        const users = result.map((doc) => {
          const user = JSON.parse(JSON.stringify(doc));
          return user;
        });
      
        return users;
    }

    const users = await getUsers();

    
    return (
        <>
            {users.map((user) => (
                <div key={user._id}>
                    {user.username}
                </div>
            ))}
            <AdminDashboardClient />
        </>
    );
};