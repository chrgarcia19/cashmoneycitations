'use client'
import React, { startTransition, useState } from "react";
import useSWR from "swr";
import { Card, CardHeader, CardBody, CardFooter, Divider, Input, Image, Button, Checkbox} from "@nextui-org/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";


const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

    
const ChangeField = ({ label, type, name, onFormSubmit, value, handleTextInputChange }: any) => (
    <form method="PUT" onSubmit={onFormSubmit} className="p-2">
        <label htmlFor={name}>New {label}:</label>
        <input 
            type={type} 
            id={name} 
            name={name} 
            value={value} 
            onChange={handleTextInputChange}/>
        <Button
            type="submit" 
            color="success" 
            endContent={<IoMdCheckmarkCircleOutline />}>
            Update {label}
        </Button>
        {/*<button type="submit">Change {label}</button>*/}
    </form>
)

const DeleteProfile = ({handleDeleteUser}: any) => (
    <form method="DELETE" onSubmit={(e) => handleDeleteUser(e)}>
        <Button
            type="submit"
            color="danger" 
            variant="bordered" 
            startContent={<FaRegTrashCan />}>
            Delete user
        </Button>
        {/*<button type="submit">Delete Profile</button>*/}
    </form>
)


const Profile = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const { data: session, update } = useSession();
    
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    
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

    /*const [isVisibleOldPass, setIsVisibleOldPass] = useState(false);
    const [isVisibleNewPass, setIsVisibleNewPass] = useState(false);
    const [isVisibleRePass, setIsVisibleRePass] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    const toggleVisibilityOldPass = () => setIsVisibleOldPass(!isVisibleOldPass);
    const toggleVisibilityNewPass = () => setIsVisibleNewPass(!isVisibleNewPass);
    const toggleVisibilityRePass = () => setIsVisibleRePass(!isVisibleRePass);
    const toggleChecked = () => setIsSelected(!isSelected);*/

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
                    <CardBody>
                    <div className="flex flex-col">
                            <p className="text-md font-bold">Here are your profile details:</p>
                            <p className="text-sm ml-6">Role: {data.role}</p>
                            <p className="text-sm ml-6">First Name: {data.firstName}</p>
                            <p className="text-sm ml-6">Last Name: {data.lastName}</p>
                            <p className="text-sm ml-6">Email Address: {data.email}</p>
                        </div>
                    </CardBody>
                    <Divider/>
                    <CardFooter>
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
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <h4 className="font-bold text-lg">Edit Profile</h4>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                    <ChangeField 
                        label="Username" 
                        type="text" 
                        name="newUsername" 
                        onFormSubmit={handleUpdateUser} 
                        value={newUsername} 
                        handleTextInputChange={(e: any) => handleTextInputChange(e, setNewUsername)}/>
                    <Divider/>
                    <ChangeField 
                        label="Email" 
                        type="email" 
                        name="newEmail" 
                        onFormSubmit={handleUpdateUser} 
                        value={newEmail} 
                        handleTextInputChange={(e: any) => handleTextInputChange(e, setNewEmail)}/>
                    </CardBody>
                    <Divider/>
                    <ChangeField 
                        label="Password" 
                        type="password" 
                        name="newPassword" 
                        onFormSubmit={handleUpdateUser} 
                        value={newPassword} 
                        handleTextInputChange={(e: any) => handleTextInputChange(e, setNewPassword)}/>
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