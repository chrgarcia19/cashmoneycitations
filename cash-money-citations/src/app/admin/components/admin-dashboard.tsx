'use client'
import { useRouter } from 'next/navigation';
import router from 'next/router';
import React, { startTransition, useEffect, useState } from 'react';
import { GetDatabaseStatus } from '../adminActions';

export default function AdminDashboardClient() {
    const [userEmail, setUserEmail] = useState<string[]>([]);
    const router = useRouter();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, email: any) {
        if (e.target.checked) {
            setUserEmail([...userEmail, email]);
        } else {
            setUserEmail(userEmail.filter(uesrEmail => userEmail !== email));
        }
    }

    
    async function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Add userEmail to the form data
        userEmail.forEach((email) => {
            formData.append(`userEmail`, email);
        })
        await fetch('/api/auth/updateUser', { method: "PUT", body: formData });
        startTransition(() => {
            router.refresh();

        })
    }


    return (
        <>
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
        </>
    );
};

type DBStatisticObject = {
    db: string,
    objects: number,
    indexes: number,
    totalSize: number,
}

export const DisplayServerStatistics = () => {
    const [serverStats, setServerStats] = useState<DBStatisticObject | {}>({});

    useEffect(() => {
      const fetchServerStats = async () => {
        const stats = await GetDatabaseStatus();
        setServerStats(stats);
      };
  
      fetchServerStats();
    }, []);
  
    if (!serverStats) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 row-gap-8 md:grid-cols-4">
        <div className="text-center">
            <h6 className="text-3xl font-bold text-deep-purple-accent-400">
                {(serverStats as DBStatisticObject).db}
            </h6>
            <p className="font-bold">Current Database</p>
        </div>
          <div className="text-center">
            <h6 className="text-3xl font-bold text-deep-purple-accent-400">
              {(serverStats as DBStatisticObject).objects}
            </h6>
            <p className="font-bold">Total Objects</p>
          </div>
          <div className="text-center">
            <h6 className="text-3xl font-bold text-deep-purple-accent-400">
              {(serverStats as DBStatisticObject).indexes}
            </h6>
            <p className="font-bold">Indexes</p>
          </div>
          <div className="text-center">
            <h6 className="text-3xl font-bold text-deep-purple-accent-400">
              {(serverStats as DBStatisticObject).totalSize}
            </h6>
            <p className="font-bold">Total Database size</p>
          </div>
        </div>
      </div>
    );
  };
  