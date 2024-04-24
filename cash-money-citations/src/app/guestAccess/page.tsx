"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import React from "react";

interface DecodedToken {
  guest: boolean;
  exp: number;
}

const page = () => {
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    const token =
      sessionStorage.getItem("guestToken") ||
      sessionStorage.getItem("userToken");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        if (decoded.exp > Date.now() / 1000) {
          setIsGuest(decoded.guest);
          setHasAccess(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  if (!hasAccess) {
    return <p>Please log in or continue as a guest to access this feature.</p>;
  }

  return (
    <div className={`${isGuest ? 'bg-gray-100 dark:bg-gray-800' : ''} p-5 rounded-lg shadow-md`}>
      {isGuest ? (
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Welcome, Guest! Here are some features you can use:</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* List of Links styled as cards */}
            <CardLink href="/feature1" text="Feature 1" />
            <CardLink href="/feature2" text="Feature 2" />
            <CardLink href="/feature3" text="Feature 3" />
            <CardLink href="/feature4" text="Feature 4" />
            <CardLink href="/feature5" text="Feature 5" />
            <CardLink href="/feature6" text="Feature 6" />
          </div>
        </div>
      ) : ''}
    </div>
  );
};

// Card Link component for cleaner code
const CardLink = ({ href, text }: {href: string, text: string}) => (
  <Link href={href}>
    <div className="block py-2 rounded-lg bg-blue-200 hover:bg-blue-300 text-center text-blue-800 font-medium shadow-lg">
      {text}
    </div>
  </Link>
);
export default page;
