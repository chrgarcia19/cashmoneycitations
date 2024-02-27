'use client'
import { useRouter } from 'next/navigation';

const ErrorPage = () => {
    const router = useRouter();

    return (
        <>
            <div>
                <h1>Error: Unauthorized</h1>
                <p>You do not have proper credentials to access this page.</p>
                <button onClick={() => router.push('/')}>Go back to home</button>
            </div>
        </>
    );
};

export default ErrorPage;