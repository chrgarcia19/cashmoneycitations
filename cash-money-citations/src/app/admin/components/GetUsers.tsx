import React from 'react';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';


export default async function GetUsers() {

    await dbConnect();
    
    const result = await User.find({});
    const users = result.map((doc) => {
        const user = JSON.parse(JSON.stringify(doc));
        return user;
    });
      
    return (
        <>
            <table className='border-collapse border-spacing-2 border border-slate-400 divide-y divide-gray-200'>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} >
                            <td className='border border-slate-300'>{user.username}</td>
                            <td className='border border-slate-300'>{user.role}</td>
                            <td className='border border-slate-300'>{user.email}</td>
                            <td className='border border-slate-300'>
                                <ul>
                                    {user.accounts.map((account: any) => (
                                        <li key={account}>{JSON.parse(JSON.stringify(account.provider))}</li>))}
                                    
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            

        </>
    )
}