"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const UserInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    profileImage: "/pfp.jpeg", // Default profile image
    subscriptionType: "Premium", // Dummy data for subscription type
    engagementLevel: "High", // Dummy data for engagement level
  });
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUserInfo({
        name: session.user.name || "Anonymous",
        email: session.user.email || "No email available",
        profileImage: session.user.image || "/pfp.jpeg", // Check for user image, or use default
        subscriptionType: "Premium", // Dummy data
        engagementLevel: "High", // Dummy data
      });
      setLoading(false);
    }
  }, [session, status]);

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 flex flex-col items-center justify-between transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-green-800 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">User Information</h2>
      <div className="flex flex-row items-center">
        <div className="flex-shrink-0">
          <img src={userInfo.profileImage} alt="User Profile" className="w-32 h-32 rounded-full mb-4 object-cover" />
        </div>
        <div className="ml-6 text-center">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : (
            <>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">Name: {userInfo.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email: {userInfo.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Subscription: {userInfo.subscriptionType}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Engagement Level: {userInfo.engagementLevel}</p>
              <Link href="/profile">
                <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                  Go to Profile
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
