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
            {users.map((user) => (
                <div key={user._id}>
                    <div>{user.username}</div>
                    <div>{user.type}</div>
                </div>
            ))}
        </>
    )
}