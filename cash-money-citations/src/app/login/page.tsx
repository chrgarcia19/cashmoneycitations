import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import {AiFillFacebook} from 'react-icons/ai'
import Link from 'next/link'
import { getProviders } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { SignIn } from '@/components/AuthButtons'


export default async function Login() {
    const session = await getServerSession()
    const providers = await getProviders()

    if (session) {
        redirect("/");
    }

    if (!providers) {
        return <div>Sign in not available</div>
    }

  return (
    <div className='relative w-full h-screen bg-zinc-700'>
    <div className='flex justify-center items-center h-full'>
        
        <form className='max-w-[400px] w-full mx-auto bg-white p-8'>
            <h2 className='text-4xl font-bold text-center py-4'>Cash Money Citations</h2>
            <div className='flex justify-between py-8'>
                <p className='border shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center'><SignIn providers={providers} /></p>
                
                <p className='border shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center'><FcGoogle className='mr-2' /> Google</p>
            </div>
            <div className='flex flex-col mb-4'>
                <label>Username</label>
                <input className='border relative bg-gray-100 p-2' type="text" />
            </div>
            <div className='flex flex-col '>
                <label>Password</label>
                <input className='border relative bg-gray-100 p-2' type="password" />
            </div>
            <button className='w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white'>Sign In</button>
            <p className='flex gap-3 ml-2 mr-1 mb-1 mt-4'><input className='w-6 h-6' type="checkbox"/>Remember Me</p>
            <Link className="bg-white p-2 text-center mt-8" href={"/login/register"}>Not a member? Sign up now</Link>
        </form>
    </div>
    </div>
  )
}