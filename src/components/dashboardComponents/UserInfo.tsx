"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, Button } from "@nextui-org/react";

type Props = {
  user: any;
}

const UserInfo = (props: Props) => {

  const { data: session, status } = useSession();

  const [userInfo, setUserInfo] = useState({
    name: props.user.firstName + " " + props.user.lastName,
    username: props.user.username,
    email: props.user.email,
    role: props.user.role,
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUserInfo({
        name: props.user.firstName + " " + props.user.lastName,
        username: props.user.username,
        email: props.user.email,
        role: props.user.role,
      });
    }
  }, [session, status]);

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 flex flex-col items-center justify-between transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-green-800 hover:shadow-lg">
      <h2 className="text-2xl underline font-semibold mb-2 text-gray-800 dark:text-gray-200">User Information</h2>
      <div className="flex flex-row items-center">
        <div className="flex-shrink-0">
          {session?.user?.role === "admin" && (
            <Avatar
              isBordered
              className="transition-transform w-32 h-32 rounded-full mb-4 object-cover"
              color="danger"
              size="lg"
              src={session?.user?.image ?? undefined}
              showFallback
            />
          ) || session?.user?.role === "user" && (
            <Avatar
              isBordered
              className="transition-transform w-32 h-32 rounded-full mb-4 object-cover"
              color="success"
              size="lg"
              src={session?.user?.image ?? undefined}
              showFallback
            />
          ) || (
            <Avatar
              isBordered
              className="transition-transform w-32 h-32 rounded-full mb-4 object-cover"
              color="default"
              size="lg"
              src={session?.user?.image ?? undefined}
              showFallback
            />
          )}
          
        </div>
        <div className="ml-6 text-left">
          <>
            {userInfo.name && (
              <p className="text-lg font-bold text-gray-800 dark:text-white">Name: {userInfo.name}</p>
            ) || (
              <p className="text-lg font-bold text-gray-800 dark:text-white">Username: {userInfo.username}</p>
            )}
            {userInfo.username && (
              <p className="text-sm text-black dark:text-white">Username: {userInfo.username}</p>
            )}
            {userInfo.email && (
              <p className="text-sm text-black dark:text-white">Email: {userInfo.email}</p>
            )}
            {userInfo.role && (
              <p className="text-sm text-black dark:text-white">Role: {userInfo.role}</p>
            )}
            <Button className="mt-5 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              color="primary"
              size="lg"
              as={Link}
              href={`/profile/${session?.user?.id}?id=${session?.user?.id}`}>
                  User Profile
            </Button>
          </>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
