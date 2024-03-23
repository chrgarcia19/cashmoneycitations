import React from 'react';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import UserView from './UserView';

export default async function GetUsers(currentUser: any) {

    await dbConnect();
    const query = { email: { $ne: currentUser.currentUser } }

    const result = await User.find(query);
    const users = result.map((doc) => {
        const user = JSON.parse(JSON.stringify(doc));
        return user;
    });

    

    return (
        <>
        {/* <div>
            <table className='border-collapse border-spacing-2 border border-slate-400 divide-y divide-gray-200'>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserView key={user._id} {...user}/>
                        ))}

                </tbody>
            </table>
        </div> */}

<div className="flex-grow overflow-x-auto shadow-md sm:rounded-lg">
    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-6">
            Username
          </th>
          <th scope="col" className="py-3 px-6">
            Role
          </th>
          <th scope="col" className="py-3 px-6">
            Email
          </th>
          <th scope="col" className="py-3 px-6">
            Type
          </th>
          <th scope="col" className="py-3 px-6">
            Select
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserView key={user._id} {...user} />
        ))}
      </tbody>
    </table>
  </div>

        </>
    )
}