'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUser } from "./componentActions/actions";
import { EmailInUseError } from "./EmailInUseError";
import FormField from "./FormField";
import PasswordField from "./PasswordFormField";
import { Button } from "@nextui-org/react";
import { LogCMCError } from "./componentActions/logActions";

interface RegistrationData {
    username: string;
    firstName: string;
    lastName: string; 
    email: string;
    password: string;
    verifyPassword: string;
}

interface Error {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    verifyPassword?: string;
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
        verifyPassword: registrationForm.verifyPassword,
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
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)){ err.email = "Please enter a valid email address!"}
        if (!form.password){ err.password = "A password is required!"};
        if (!form.verifyPassword){ err.verifyPassword = "Please verify your password!"};
        if (form.password !== form.verifyPassword){err.verifyPassword = "Passwords do not match!"};
        if (form.username.length < 4){ err.username = "Your username must not be less than 4 characters!"};
        if (form.password.length < 6){ err.password = "Your password must not be less than 6 characters!"};
        return err;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const errs = formValidate();

        if (Object.keys(errs).length === 0) {
            
            const createUserResponse = await createUser(form);
            LogCMCError("SUCCESS", "USER", `New User Created: ${createUserResponse?.message}`)

            if (createUserResponse?.exists) {
                setEmailInUse(true);
            } else {
                setEmailInUse(false);
                router.push('/');
            }

        } else {
            LogCMCError("FAILED", "USER", "REGISTRATION ERROR WITH SUBMISSION")
            setErrors( { errs });
            if (errs.username) {
                alert(errs.username);
            }
            if (errs.firstName) {
                alert(errs.firstName);
            }
            if (errs.lastName) {
                alert(errs.lastName);
            }
            if (errs.email) {
                alert(errs.email);
            }
            if (errs.password) {
                alert(errs.password);
            }
            if (errs.verifyPassword) {
                alert(errs.verifyPassword);
            }
        }
    };

    return (
        <>
        <div className='relative w-full h-screen flex justify-center items-center'>
            <form id={formId} onSubmit={handleSubmit} 
                className="w-3/4 max-w-[800px] mx-auto bg-white dark:bg-zinc-600 p-8 rounded-xl shadow-xl overflow-hidden">
                {emailInUse && <EmailInUseError />}
            <h2 className='text-4xl font-bold text-center py-4 text-green-600 dark:text-green-500'>Register</h2>
                <FormField 
                    required={true} 
                    labelText={"Username:"} 
                    fieldName={"username"} 
                    fieldValue={form.username} 
                    fieldType={"text"} 
                    fieldPlaceholder={"Username"} 
                    handleChange={handleChange} />

                <FormField 
                    required={true} 
                    labelText={"First Name:"} 
                    fieldName={"firstName"} 
                    fieldValue={form.firstName} 
                    fieldType={"text"} 
                    fieldPlaceholder={"First Name"} 
                    handleChange={handleChange} />

                <FormField 
                    required={true} 
                    labelText={"Last Name:"} 
                    fieldName={"lastName"} 
                    fieldValue={form.lastName} 
                    fieldType={"text"} 
                    fieldPlaceholder={"Last Name"} 
                    handleChange={handleChange} />

                <FormField 
                    required={true} 
                    labelText={"Email Address:"} 
                    fieldName={"email"} 
                    fieldValue={form.email} 
                    fieldType={"text"} 
                    fieldPlaceholder={"Email Address"} 
                    handleChange={handleChange} />

                <PasswordField 
                    labelText={"Password: "} 
                    fieldName={"password"} 
                    fieldValue={form.password} 
                    fieldPlaceholder={"Password"} 
                    handleChange={handleChange} />

                <PasswordField 
                    labelText={"Verify Password: "} 
                    fieldName={"verifyPassword"} 
                    fieldValue={form.verifyPassword} 
                    fieldPlaceholder={"Verify Password"} 
                    handleChange={handleChange} />

                <Button type="submit" color="success" className="text-white font-bold text-lg w-full py-3 mt-8">Sign Up</Button>
            </form>
    </div>
    </>
    );
};

export default RegistrationForm;