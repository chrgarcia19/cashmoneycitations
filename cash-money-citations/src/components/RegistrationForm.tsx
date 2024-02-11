'use client'

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR, { mutate } from "swr";

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

const RegistrationForm = ({formId, registrationForm, forNewUser = true }: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const contentType = "application/json";
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        username: registrationForm.username,
        firstName: registrationForm.firstName,
        lastName: registrationForm.lastName,
        email: registrationForm.email,
        password: registrationForm.password,
    });

    const id = searchParams.get("id");

    const fetcher = async (url: string) => {
        const res = await fetch(`/api/registration/${id}`);
        if (!res.ok){ throw new Error("An error occurred while fetching the data."); }
        return res.json();
    };

    const useData = (url: string) => {
        const { data, error, mutate } = useSWR(url, fetcher);

        return {
            data,
            error,
            isLoading: !data && !error,
            mutate,
        };
    };

    const putData = async (form: RegistrationData) => {
        const id = searchParams.get("id");
    
        try {
            const res = await fetch(`/api/registration/${id}`, {
                method: "PUT",
                headers: {
                    Accept: contentType,
                    "Content-Type": contentType,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok){
                throw new Error(res.status.toString());
            }

            const { data } = await res.json();
            mutate(`/api/registration/${id}`, data, true);

            router.push("/");
            router.refresh();
        } catch (error) {
            setMessage("Failed to add user!");
        }
    };

    const postData = async (form: RegistrationData) => {
        try {
            const res = await fetch("/api/registration", {
                method: "POST",
                headers: {
                    Accept: contentType,
                    "Content-Type": contentType,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok){
                throw new Error(res.status.toString());
            }
            router.push("/");
            router.refresh();
        } catch (error) {
            setMessage("Failed to add user!");
        }
    };

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errs = formValidate();

        if (Object.keys(errs).length === 0) {
            forNewUser ? postData(form) : putData(form);
        } else {
            setErrors( { errs });
        }
    };

    return (
        <>
        <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-3">

            <label>Username:</label>
            <input
                name="username" 
                className="border border-slate-500"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
            />

            <label>First Name:</label>
            <input
                name="firstName" 
                className="border border-slate-500"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
            />

            <label>Last Name:</label>
            <input
                name="lastName" 
                className="border border-slate-500"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
            />

            <label>Email:</label>
            <input
                name="email" 
                className="border border-slate-500"
                type="text"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
            />

            <label>Password:</label>
            <input
                name="password" 
                className="border border-slate-500"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
            />

            <button type="submit" className="w-full py-3 mt-8 bg-indigo-600 
            hover:bg-indigo-500 relative text-white">Register</button>
        </form>
        <p>{message}</p>
        <div>
            {Object.keys(errors).map((err, index) => (
                <li key={index}>{err}</li>
            ))}
        </div>
    </>
    );
};

export default RegistrationForm;