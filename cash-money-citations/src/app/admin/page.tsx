import React from 'react';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import AdminDashboardClient from './components/admin-dashboard';
import GetUsers from './components/GetUsers';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';

export default async function AdminDashboard() {
    const session = await getServerSession(authConfig);
    const currentUserEmail = session?.user?.email

        return (
        <>
            <GetUsers currentUser={currentUserEmail}/>
            {/* <SessionInfo /> */}
            {/* <AdminDashboardClient /> */}
        </>
    );
};