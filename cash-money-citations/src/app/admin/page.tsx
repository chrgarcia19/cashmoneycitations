import React from 'react';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import AdminDashboardClient from './components/admin-dashboard';
import ImportCSLStyles from './components/ImportCSLStyles';
import GetUsers from './components/GetUsers';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import importCSLFiles from '@/utils/initCslStylesDb';
import importLocaleFiles from '@/utils/initLocaleDb';
import ImportLocale from './components/ImportLocale';
import GetLocales, { GetCslStyles } from './components/ViewCslLocale';

export default async function AdminDashboard() {
    const session = await getServerSession(authConfig);
    const currentUserEmail = session?.user?.email

    async function handleCslSubmit(cslDirectory: any) {
        'use server';

        const res = await importCSLFiles(cslDirectory);
        return res;
    }
    
    async function handleLocaleSubmit(localeDirectory: any) {
        'use server';

        const res = await importLocaleFiles(localeDirectory);
        return res;
    }

        return (
        <>
        <div className="bg-white shadow rounded-lg p-6">

            <GetUsers currentUser={currentUserEmail}/>
            {/* <SessionInfo /> */}
            {/* <AdminDashboardClient /> */}
        </div>
        <span className=" space-x-4 mt-6">
            <ImportCSLStyles handleCslSubmit={handleCslSubmit}/>
            <ImportLocale handleLocaleSubmit={handleLocaleSubmit}/>
        </span>
        <span>
            <GetCslStyles/>
            <GetLocales />
        </span>
        </>
    );
};