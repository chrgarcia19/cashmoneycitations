'use client'
import React, { startTransition, useState } from "react";
import useSWR from "swr";
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Checkbox, CheckboxGroup} from "@nextui-org/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { FaArrowAltCircleDown, FaUser } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";


const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

    
const ChangeField = ({ label, type, name, onFormSubmit, value, handleTextInputChange }: any) => (
    <form method="PUT" onSubmit={onFormSubmit} className="p-2">
        <label htmlFor={name}>New {label}:</label>
        <input 
            className="dark: text-white"
            type={type} 
            id={name} 
            name={name} 
            value={value} 
            onChange={handleTextInputChange}/>
        <div className="flex justify-end">
            <Button
                type="submit" 
                color="success"
                endContent={<FiUserCheck />}>
                Update {label}
            </Button>
        </div>
        
        {/*<button type="submit">Change {label}</button>*/}
    </form>
)

const DeleteProfile = ({handleDeleteUser}: any) => (
    <form method="DELETE" onSubmit={(e) => handleDeleteUser(e)}>
        <Button
            type="submit"
            color="danger" 
            variant="bordered" 
            startContent={<FaUser />}>
            Delete User
        </Button>
    </form>
)


const Profile = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const { data: session, update } = useSession();
    const [selected, setSelected] = useState([""]);
    
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    const sessionData = useSession();
    
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
            formData.append('newUsername', usernameChange);
        }
        if (emailChange) {
            formData.append('newEmail', emailChange);
        }
        if (passwordChange) {
            formData.append('newPassword', passwordChange);
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

        router.push("/");
        router.refresh();
    }

    async function handleDeleteUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Add userEmail to the form data
        if (userEmail) {
            formData.append(`userEmail`, userEmail);
        } else {
            console.error("Email NOT Added : in handleDeleteUser Function")
        }

        await fetch('/api/auth/updateUser', { method: "DELETE", body: formData });
        setIsFetching(false);
        startTransition(() => {
            signOut({ callbackUrl: '/login'})
            router.refresh();

        })
    }

    function handleTextInputChange(e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) {
        setter(e.target.value);
    }

    return (
        <>
            <div className="flex items-center justify-center pt-5">
                <Card>
                    <CardHeader className="flex items-center justify-center">
                        <h2 className="font-bold text-2xl">
                            Hello, {data.username}!
                        </h2>                        
                    </CardHeader>
                    <Divider/>
                    <CardBody className="flex items-center justify-center">
                        <div className="flex flex-col">
                            <p className="text-md font-bold">Here are your profile details:</p>
                            <p className="text-sm ml-6">Role: {data.role}</p>
                            <p className="text-sm ml-6">First Name: {data.firstName}</p>
                            <p className="text-sm ml-6">Last Name: {data.lastName}</p>
                            <p className="text-sm ml-6">Email Address: {data.email}</p>
                        </div>
                    </CardBody>
                    <Divider/>
                    <CardFooter className="flex items-center justify-center">
                        <FaArrowAltCircleDown />
                            <div className="ms-4 me-4">
                                Change your profile below
                            </div>
                        <FaArrowAltCircleDown />
                    </CardFooter>
                </Card>
            </div>
            <div className="flex items-center justify-center pt-5">
                <Card className="w-1/4">
                    <CardHeader className="flex gap-3 items-center justify-center">
                        <div className="flex flex-col">
                            <h2 className="font-bold text-2xl">Edit Profile</h2>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <CheckboxGroup
                            label="Select Profile Options to Update"
                            color="primary"
                            value={selected}
                            onValueChange={setSelected}
                        >
                            {sessionData.data?.user?.accountType != "oauth" && (
                                <>
                                    <Checkbox value="updateUsername">Update Username</Checkbox>
                                    <Checkbox value="updateEmail">Update Email</Checkbox>
                                    <Checkbox value="updatePassword">Update Password</Checkbox>
                                </>
                            )}
                        </CheckboxGroup>
                        {selected.includes("updateUsername") && (
                            <>
                                <ChangeField
                                    label="Username"
                                    type="text"
                                    name="newUsername"
                                    onFormSubmit={handleUpdateUser}
                                    value={newUsername}
                                    handleTextInputChange={(e: any) => handleTextInputChange(e, setNewUsername)} />
                            </>
                        )}
                        {selected.includes("updateEmail") && (
                            <>
                                <ChangeField 
                                    label="Email" 
                                    type="email" 
                                    name="newEmail" 
                                    onFormSubmit={handleUpdateUser} 
                                    value={newEmail} 
                                    handleTextInputChange={(e: any) => handleTextInputChange(e, setNewEmail)}/>
                            </>
                        )}
                        {selected.includes("updatePassword") && (
                            <>
                                <ChangeField 
                                    label="Password" 
                                    type="password" 
                                    name="newPassword" 
                                    onFormSubmit={handleUpdateUser} 
                                    value={newPassword} 
                                    handleTextInputChange={(e: any) => handleTextInputChange(e, setNewPassword)}/>
                            </>
                        )}
                    </CardBody>                
                    <Divider/>
                    <CardFooter>
                        <DeleteProfile handleDeleteUser={handleDeleteUser}/>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default Profile;