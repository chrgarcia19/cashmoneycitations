"use client"

import { getSpecificUserById } from "@/components/componentActions/actions";
import { useEffect, useState } from "react";
import { FaArrowAltCircleDown } from "react-icons/fa";
import {Card, CardHeader, CardBody, CardFooter, Divider, Input, Image, Button} from "@nextui-org/react";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";

interface ProfileData {
    username: string,
    email: string,
    password: string,
}

type Props = {
    userId: string;
    profileForm: ProfileData;
}

const Profile = (props: Props) => {
    const [user, setUser] = useState(Object);

    const [newUsername, setNewUsername] = useState("");

    
  
    const [form, setForm] = useState({
        username: user.username,
        email: user.email,
        password: user.password,
    });

    // Fetch initial citation state
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const userData = await getSpecificUserById(props.userId);  
        setUser(userData);
    }

    /*const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        setForm({
          ...form,
          [name]: value,
        });
    };*/

    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <> 
            <div className="flex items-center justify-center pt-5">
                <Card>
                    <CardHeader className="flex gap-3">
                        <Image
                        alt="Profile Image"
                        height={40}
                        radius="sm"
                        src={user.image}
                        width={40}
                        />
                        <div className="flex flex-col">
                            <h4 className="font-bold text-lg">Hello {user.username}!</h4>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <div className="flex flex-col">
                            <p className="text-md font-bold">Here are your profile details:</p>
                            <p className="text-sm ml-6">First Name: {user.firstName}</p>
                            <p className="text-sm ml-6">Last Name: {user.lastName}</p>
                            <p className="text-sm ml-6">Email Address: {user.email}</p>
                        </div>
                    </CardBody>
                    <Divider/>
                    <CardFooter>
                        <FaArrowAltCircleDown />
                        <div className="ms-4 me-4">Change your profile below </div>
                        <FaArrowAltCircleDown />
                    </CardFooter>
                </Card>
            </div>
            <div className="flex items-center justify-center pt-10">
                <Card className="w-1/5">
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <h4 className="font-bold text-lg">Edit Profile</h4>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <form>
                    <CardBody>
                        
                            <Input
                                isRequired
                                type="text"
                                label="Username"
                                labelPlacement="outside"
                                placeholder="Username"
                                value={form.username}
                                onValueChange={setNewUsername}
                                description="Enter your new username"
                                className="max-w-xs"
                            /> 
                            <Input
                                isRequired
                                type="email"
                                label="Email"
                                labelPlacement="outside"
                                placeholder="Enter your new email"
                                description="Enter your new email"
                                className="max-w-xs"
                            /> 
                            <Input
                                isRequired
                                type={isVisible ? "text" : "password"}
                                label="Password"
                                labelPlacement="outside"
                                placeholder="Enter your new password"
                                description="Enter your new password"
                                className="max-w-xs"
                                endContent={
                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                        {isVisible ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>
                                }                                
                            />  
                                              
                        </CardBody>
                        <Divider/>
                        <CardFooter>
                            <div className="flex items-center justify-center">
                                <Button color="danger" variant="bordered" startContent={<FaRegTrashCan />}>
                                    Delete user
                                </Button>
                                <Button color="success" endContent={<IoMdCheckmarkCircleOutline />}>
                                    Update Profile
                                </Button>
                            </div>
                        </CardFooter>
                        </form>
                    </Card>
            </div>
        </>
    )
}

export default Profile;