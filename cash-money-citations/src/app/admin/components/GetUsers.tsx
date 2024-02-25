import React from 'react';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import UserView from './UserView';

export default async function GetUsers() {

    await dbConnect();
    
    const result = await User.find({});
    const users = result.map((doc) => {
        const user = JSON.parse(JSON.stringify(doc));
        return user;
    });



    return (
        <>
        <div>
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
        </div>

        </>
    )
}