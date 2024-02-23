'use client'
import { useSession } from 'next-auth/react';

const SessionInfo = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Welcome, {session?.user?.name}!</h2>
            <p>Email: {session?.user?.role}</p>
            {/* <p>Access Token: {session?.accessToken}</p>
            <p>Refresh Token: {session?.refreshToken}</p> */}
        </div>
    );
};

export default SessionInfo;