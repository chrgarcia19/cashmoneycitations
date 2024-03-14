'use client'
import React from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import ChangeUsername from "./ChangeUsername";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

const Profile = () => {

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
    return (
        <div>
            <h2 className="text-align-center text-2xl text-slate-500">Hello, {data.username}!</h2>

            <p>Username: {data.username}</p>
            <ChangeUsername />

            <p>First Name: {data.firstName}</p>

            <p>Last Name: {data.lastName}</p>

            <p>Email: {data.email}</p>
            <form>
                <label htmlFor="newEmail">New Email:</label>
                <input type="password" id="newEmail" name="newEmail" />
                <button type="submit">Change Email</button>
            </form>

            <form>
                <label htmlFor="newPassword">New Password:</label>
                <input type="password" id="newPassword" name="newPassword" />
                <button type="submit">Change Password</button>
            </form>
            <p>Role: {data.role}</p>
        </div>
    )
}

export default Profile;