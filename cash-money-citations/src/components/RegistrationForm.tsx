'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUser } from "./componentActions/actions";
import { EmailInUseError } from "./EmailInUseError";

interface RegistrationData {
    username: string;
    firstName: string;
    lastName: string; 
    email: string;
    password: string;
}

interface Error {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

type Props = {
    formId: string;
    registrationForm: RegistrationData;
    forNewUser?: boolean;
};

const RegistrationForm = ({formId, registrationForm}: Props) => {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [emailInUse, setEmailInUse] = useState(false);

    const [form, setForm] = useState({
        username: registrationForm.username,
        firstName: registrationForm.firstName,
        lastName: registrationForm.lastName,
        email: registrationForm.email,
        password: registrationForm.password,
    });


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const formValidate = () => {
        let err: Error = {};
        if (!form.username){ err.username = "A username is required!"};
        if (!form.firstName){ err.firstName = "A first name is required!"};
        if (!form.lastName){ err.lastName = "A last name is required!"};
        if (!form.email){ err.email = "An email is required!"};
        if (!form.password){ err.password = "A password is required!"};
        return err;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const errs = formValidate();

        if (Object.keys(errs).length === 0) {
            
            const createUserResponse = await createUser(form);
            if (createUserResponse?.exists) {
                setEmailInUse(true);
            } else {
                setEmailInUse(false);
                router.push('/');
            }

           
        } else {
            setErrors( { errs });
        }
    };

    return (
        <>
        <div className='relative w-full h-screen bg-zinc-900/90 flex justify-center items-center'>
            <form id={formId} onSubmit={handleSubmit} className="w-3/4 max-w-[800px] mx-auto bg-white p-8">
                {emailInUse && <EmailInUseError />}
            <h2 className='text-4xl font-bold text-center py-4 text-green-600'>Register</h2>
                <div className="flex flex-col mb-4">
                <label className="capitalize">Username:</label>
                <input
                    name="username" 
                    className="border p-2 w-full bg-gray-100"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                />
                </div>

                <div className="flex flex-col mb-4">
                <label className="capitalize">First Name:</label>
                <input
                    name="firstName" 
                    className="border p-2 w-full bg-gray-100"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                />
                </div>

                <div className="flex flex-col mb-4">
                <label className="capitalize">Last Name:</label>
                <input
                    name="lastName" 
                    className="border p-2 w-full bg-gray-100"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                />
                </div>

                <div className="flex flex-col mb-4">
                <label className="capitalize">Email:</label>
                <input
                    name="email" 
                    className="border p-2 w-full bg-gray-100"
                    type="text"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                </div>

                <div className="flex flex-col mb-4">
                <label className="capitalize">Password:</label>
                <input
                    name="password" 
                    className="border p-2 w-full bg-gray-100"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                </div>

                <button type="submit" className="w-full py-3 mt-8 bg-green-600 hover:bg-green-500 relative text-white">Sign Up</button>
            </form>
        <div>
            <p>{message}</p>
            {Object.keys(errors).map((err, index) => (
                <li key={index}>{err}</li>
            ))}
        </div>
    </div>
    </>
    );
};

export default RegistrationForm;