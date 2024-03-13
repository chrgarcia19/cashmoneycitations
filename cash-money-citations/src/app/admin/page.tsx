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
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import util from 'util';
import os from 'os';

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const stat = util.promisify(fs.stat);

export default async function AdminDashboard() {
    const session = await getServerSession(authConfig);
    const currentUserEmail = session?.user?.email



    async function handleCslSubmit(cslDirectory: any) {
        'use server';
        const file: File | null = cslDirectory.get('file') as unknown as File;
        
        if (!file) throw new Error("No file uploaded");

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const tmpFilePath = path.join(os.tmpdir(), file.name);
        fs.writeFileSync(tmpFilePath, buffer);

        const zip = new AdmZip(tmpFilePath);
        const extractPath = './tmp'
        zip.extractAllTo(extractPath, /*overwrite*/true);

        async function processDirectory(directory: string) {
            const files = await readdir(directory);
            for (const file of files) {
              const filePath = path.join(directory, file);
              const stats = await stat(filePath);
          
              if (stats.isDirectory()) {
                await processDirectory(filePath);
              } else {
                const fileData = await readFile(filePath, 'utf8');
                await importCSLFiles({ name: file, contents: fileData });
                await unlink(filePath);
              }
            }
        }
        
        await processDirectory(extractPath);
        await rmdir(extractPath);
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