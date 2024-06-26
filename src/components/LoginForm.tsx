'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaGithubSquare } from "react-icons/fa";
import {FcGoogle} from 'react-icons/fc'
import { IconContext } from "react-icons";
import PasswordField from './PasswordFormField';
import FormField from './FormField';
import { Button, Chip } from '@nextui-org/react';
import { LogCMCError } from './componentActions/logActions';

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
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';


    


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await signIn('credentials', {
                redirect: false,
                username: username,
                password: password,
                
            });

            setLoading(false);

            if (res?.error){
                setError('Invalid Credentials');
                return;

            }

            alert("You have successfully logged in.");
            LogCMCError("SUCCESS", "USER", `User: ${username} has logged in at: ${Date.now()}`)

            router.replace("/dashboard");

            // To initiate the getServerSession() to generate dynamic NavBar
            router.refresh();
        } catch (error: any) {
            setLoading(false);
            LogCMCError("WARNING", "USER", error);
            console.log(error);
        }
    }


    return (
        <div className='relative w-full h-screen bg-gray-100 dark:bg-gray-800'>
        <div className='flex justify-center items-center h-full'>
            <form id={formId} onSubmit={handleSubmit} className='max-w-[425px] w-full mx-auto bg-white dark:bg-gray-600 p-8 rounded-xl shadow-xl overflow-hidden'>
                <h2 className='text-4xl font-bold text-center py-4 dark:bg-gray-600 dark:text-white'>Cash Money Citations</h2>
                <div className='flex justify-between py-8'>
                    <IconContext.Provider value={{ color: 'black', className: ''}}>
                        <Button className='shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center dark:bg-gray-400' 
                                color='default'
                                size='lg'
                                onClick={() => signIn('github', { callbackUrl })}>
                            <FaGithubSquare className='h-6 w-6' name='GitHub'/>
                            <Chip className='text-black px-2 py-2 relative flex items-center dark:bg-gray-400' color='default'>
                                <div className='font-bold'>GitHub</div>
                            </Chip>
                        </Button>

                        <Button className='shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center dark:bg-gray-400' 
                                color='default'
                                size='lg'
                                onClick={() => signIn('google', { callbackUrl })}>
                            <FcGoogle className='h-6 w-6' name='Google'/>
                            <Chip className='text-black px-2 py-2 relative flex items-center dark:bg-gray-400' color='default'>
                            <div className='font-bold'>Google</div>
                            </Chip>
                        </Button>
                    </IconContext.Provider>
                    
                    
                </div>
                <div className='flex flex-col mb-4'>
                    <FormField 
                        required={true} 
                        labelText={'Username'} 
                        fieldName={'username'} 
                        fieldValue={username} 
                        fieldType={'text'} 
                        fieldPlaceholder={'Username'} 
                        handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setUsername(e.target.value)} />
                </div>
                <div className='flex flex-col items-center'>
                    <PasswordField 
                        labelText={'Password'} 
                        fieldName={'password'} 
                        fieldValue={password} 
                        fieldPlaceholder={"Password"} 
                        handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setPassword(e.target.value)} />
                </div>
                <Button
                    type="submit"
                    color='success'
                    className='text-lg text-white w-full py-3 mt-8'>
                        Sign In
                </Button>
    
                {error && (
                    <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
                        {error}
                    </div>
                )}
                <br />
                <br />
                <div className='flex items-center'>
                    Not a member?
                    <Link className="bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 p-2 text-center font-bold underline" href={"/login/register"}>Sign up now</Link>
                </div>
                
            </form>
        </div>
        </div>
      );
}



export default LoginForm;