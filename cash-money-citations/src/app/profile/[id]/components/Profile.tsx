"use client"

import FormField from "@/components/FormField";
import { getSpecificUserById } from "@/components/componentActions/actions";
import { Card, CardBody, CardFooter, CardHeader, Checkbox, CheckboxGroup, Divider } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowAltCircleDown } from "react-icons/fa";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

interface ProfileData {
    newUsername: String;
    newEmail: String;
    oldPassword: String;
    newPassword: String;
    newPasswordVerify: String;
}

type Props = {
    profileForm: ProfileData;
    userId: string;
}

const Profile = (props: Props) => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    
    const [user, setUser] = useState(Object);

    const [selected, setSelected] = useState([""]);

    const [form, setForm] = useState({
        newUsername: props.profileForm.newUsername,
        newEmail: props.profileForm.newEmail,
        oldPassword: props.profileForm.oldPassword,
        newPassword: props.profileForm.newPassword,
        newPasswordVerify: props.profileForm.newPasswordVerify,
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {    
        const userData = await getSpecificUserById(props.userId);  
        setUser(userData);
    };

    const handleChange = (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        setForm({
          ...form,
          [name]: value,
        });
      };
    
    console.log(selected)

    return (
        <>
            <div className="flex items-center justify-center pt-5">
                <Card>
                    <CardHeader className="flex items-center justify-center">
                        <h2 className="font-bold text-2xl">
                            Hello, {user.username}!
                        </h2>                        
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                    <div className="flex flex-col">
                            <p className="text-md font-bold">Here are your profile details:</p>
                            <p className="text-sm ml-6">Role: {user.role}</p>
                            <p className="text-sm ml-6">First Name: {user.firstName}</p>
                            <p className="text-sm ml-6">Last Name: {user.lastName}</p>
                            <p className="text-sm ml-6">Email Address: {user.email}</p>
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
                    <CheckboxGroup
                        label="Select Profile Options to Update"
                        color="primary"
                        value={selected}
                        onValueChange={setSelected}
                    >
                    <Checkbox value="updateUsername">Update Username</Checkbox>
                    <Checkbox value="updateEmail">Update Email</Checkbox>
                    <Checkbox value="updatePassword">Update Password</Checkbox>
                    </CheckboxGroup>
                    <Divider/>
                    {selected.includes("updateUsername") && (
                        <>
                            <FormField labelText={"Enter a new Username"} fieldName={"newUsername"} fieldValue={form.newUsername} fieldType={"text"} fieldPlaceholder={"Enter a new Username"} handleChange={handleChange} />
                        </>
                    )}
                    </CardBody>
                    <Divider/>
                   
                    <Divider/>
                    <CardFooter>
                        
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default Profile;