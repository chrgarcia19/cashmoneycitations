"use client"

import { getSpecificUserById } from "@/components/componentActions/actions";
import { useEffect, useState } from "react";
import { FaArrowAltCircleDown } from "react-icons/fa";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";

type Props = {
    userId: string;
}

const Profile = (props: Props) => {
    const [user, setUser] = useState(Object);
  
    // Fetch initial citation state
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const userData = await getSpecificUserById(props.userId);  
        setUser(userData);
    }

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
                <Card>
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <h4 className="font-bold text-lg">Edit Profile</h4>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        
                    </CardBody>
                    <Divider/>
                    <CardFooter>
                        
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default Profile;