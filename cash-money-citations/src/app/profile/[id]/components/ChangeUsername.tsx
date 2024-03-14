'use client'

import { useSession } from "next-auth/react";
import React, { useState } from "react";


const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

const ChangeUsername = () => {
    const [username, setUsername] = useState('');
    const { data: session, update } = useSession();

    const userEmail = session?.user?.email;



    function handleTextInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }

    function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const usernameChange = formData.get('username');
        // Add username to the form data
        formData.append('username', username);
        if (userEmail) {
            formData.append('userEmail', userEmail)

        }

        fetch('/api/auth/updateUser', { method: "PUT", body: formData });
        const newSession = {
            ...session,
            user: {
                ...session?.user,
                username: usernameChange
            },
        };

        update(newSession);
    }

    return (
        <>

        <div>
            <form method="PUT" onSubmit={handleUpdateUser}>
                <input type="text" value={username} onChange={handleTextInputChange} className="input w-full max-w-xs" placeholder="Username"></input>
                <button type="submit">Change Username</button>
            </form>
        </div>
        </>
    )
}

export default ChangeUsername;