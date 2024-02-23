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
            <table>
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
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.email}</td>
                            <td>
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