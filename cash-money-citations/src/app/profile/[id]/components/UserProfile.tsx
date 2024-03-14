'use client'
import React, { useState } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

    
const ChangeField = ({ label, type, name, onFormSubmit, value, handleTextInputChange }: any) => (
    <form method="PUT" onSubmit={onFormSubmit}>
        <label htmlFor={name}>New {label}:</label>
        <input type={type} id={name} name={name} value={value} onChange={handleTextInputChange}/>
        <button type="submit">Change {label}</button>
    </form>
)



const Profile = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { data: session, update } = useSession();
    
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const { data, error, isLoading } = useSWR(id ? `/api/auth/getUser/${id}` : null, fetcher);

    if (error) return (
        <div>Failed {id}
        </div>
    )

    if (isLoading) return (
        <div>
            loading...
        </div>
    )

    if (!data) return null;

    const userEmail = session?.user?.email;

    async function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const usernameChange = formData.get('newUsername');
        const emailChange = formData.get('newEmail');
        const passwordChange = formData.get('newPassword');

        // Only add fields that were changed
        if (usernameChange) {
            formData.append('username', usernameChange);
        }
        if (emailChange) {
            formData.append('email', emailChange);
        }
        if (passwordChange) {
            formData.append('password', passwordChange);
        }
        if (userEmail) {
            formData.append('userEmail', userEmail)
        }
    
        const res = await fetch('/api/auth/updateUser', { method: "PUT", body: formData });
        
        if (res.status != 201) {
            console.error("Error Updating User Profile")
        } else {

            const newSession = {
                ...session,
                user: {
                    ...session?.user,
                    username: usernameChange,
                    email: emailChange ? emailChange : session?.user?.email,
                    password: passwordChange
                },
            };
        
            update(newSession);
        }
    }

    function handleTextInputChange(e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) {
        setter(e.target.value);
    }

    return (
        <div>
            <h2 className="text-align-center text-2xl text-slate-500">Hello, {data.username}!</h2>

            <p>Username: {data.username}</p>
            <ChangeField label="Username" type="text" name="newUsername" onFormSubmit={handleUpdateUser} value={newUsername} handleTextInputChange={(e: any) => handleTextInputChange(e, setNewUsername)}/>

            <p>First Name: {data.firstName}</p>

            <p>Last Name: {data.lastName}</p>

            <p>Email: {data.email}</p>
            <ChangeField label="Email" type="email" name="newEmail" onFormSubmit={handleUpdateUser} value={newEmail} handleTextInputChange={(e: any) => handleTextInputChange(e, setNewEmail)}/>

            <ChangeField label="Password" type="password" name="newPassword" onFormSubmit={handleUpdateUser} value={newPassword} handleTextInputChange={(e: any) => handleTextInputChange(e, setNewPassword)}/>
            <p>Role: {data.role}</p>
        </div>
    )
}

export default Profile;