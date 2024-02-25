import React from 'react';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import AdminDashboardClient from './components/admin-dashboard';
import GetUsers from './components/GetUsers';

export default async function AdminDashboard() {


    
    return (
        <>
            <GetUsers />
            {/* <SessionInfo /> */}
            {/* <AdminDashboardClient /> */}
        </>
    );
};