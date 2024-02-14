'use client';

import React, { useEffect, useState } from 'react'
import {FcGoogle} from 'react-icons/fc'
import Link from 'next/link'
import { ClientSafeProvider, LiteralUnion, getProviders, signIn } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { redirect, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { SignIn } from '@/components/AuthButtons'

interface LoginData {
    username: string;
    password: string;
}

interface Error {
    username?: string;
    password?: string;
}

type Props = {
    formId: string;
    loginForm: LoginData;
};
    
const LoginForm = ({formId, loginForm}: Props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [providers, setProviders] = useState<Record<LiteralUnion<string, string>, ClientSafeProvider>>({});

    const router = useRouter();

    useEffect(() => {
        const fetchProviders = async () => {
            const providersData = await getProviders();
            setProviders(providersData);
        };

        fetchProviders();
    }, []);
    
    // const fetchProviders = async() => {
    //     const providers = await getProviders();

    //     if (!providers) {
    //         return <div>Sign in not available</div>
    //     }

    //     return providers
    // }

    // const providers = fetchProviders();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await signIn('credentials', {
                redirect: false,
                username: username,
                password: password,
                
            });

            if (res?.error){
                setError("Invalid Credentials");
                return;
            }

            router.replace("/");
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='relative w-full h-screen bg-zinc-700'>
        <div className='flex justify-center items-center h-full'>
            
            <form id={formId} onSubmit={handleSubmit} className='max-w-[400px] w-full mx-auto bg-white p-8'>
                <h2 className='text-4xl font-bold text-center py-4'>Cash Money Citations</h2>
                <div className='flex justify-between py-8'>
                    <p className='border shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center'><SignIn providers={providers} /></p>
                    
                    <p className='border shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center'><FcGoogle className='mr-2' /> Google</p>
                </div>
                <div className='flex flex-col mb-4'>
                    <label>Username</label>
                    <input 
                    className='border relative bg-gray-100 p-2'
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className='flex flex-col '>
                    <label>Password</label>
                    <input 
                    className='border relative bg-gray-100 p-2' 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button className='w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white'>Sign In</button>
    
                {error && (
                    <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
                        {error}
                    </div>
                )}
    
                <p className='flex gap-3 ml-2 mr-1 mb-1 mt-4'><input className='w-6 h-6' type="checkbox"/>Remember Me</p>
                <Link className="bg-white p-2 text-center mt-8" href={"/login/register"}>Not a member? Sign up now</Link>
            </form>
        </div>
        </div>
      );
}



export default LoginForm;