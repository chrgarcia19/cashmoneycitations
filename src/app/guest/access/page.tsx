"use client";

import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import { FaPencilAlt, FaDownload, FaBookOpen, FaTable, FaPlusSquare, FaGlobeAmericas } from "react-icons/fa";

interface DecodedToken {
  guest: boolean;
  exp: number;
}

const Page = () => {
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const token = sessionStorage.getItem("guestToken") || sessionStorage.getItem("userToken");
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
    return <p className="mt-20 text-center">Please log in or continue as a guest to access this feature.</p>;
  }

  if (status === "authenticated") {
    return <p className="mt-20 text-center">You are currently logged in as a user, this feature is for guests only.</p>;
  }

  return (
    <div className={`${isGuest ? 'bg-gray-100 dark:bg-gray-800' : ''} p-5 rounded-lg shadow-md mt-20`}>
      {isGuest && (
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Welcome, Guest! Here are some features you can use:</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <CardLink href="/guest/new" text="Manually add references" icon={<FaPencilAlt className="text-2xl" />} />
            <CardLink href="/guest/input" text="Input references from external sources" icon={<FaGlobeAmericas className="text-2xl" />} />
            <CardLink href="/guest/referenceTable" text="View your generated references" icon={<FaTable className="text-2xl" />} />
            <CardLink href="/guest/displayCitation" text="Create your own bibliography" icon={<FaBookOpen className="text-2xl" />} />
            <CardLink href="/guest/export" text="Export to BibTeX & JSON" icon={<FaDownload className="text-2xl" />} />
            <CardLink href="" text="Access 2,000 different citation styles" icon={<FaPlusSquare className="text-2xl" />} />
          </div>
        </div>
      )}
    </div>
  );
};

// Card Link component with icon
const CardLink = ({ href, text, icon }: { href: string; text: string; icon: JSX.Element }) => (
  <Link href={href}>
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-200 hover:bg-blue-300 text-center text-blue-800 font-medium shadow-lg transition duration-300 ease-in-out">
      <div className="text-3xl text-blue-500 mb-2">{icon}</div>
      {text}
    </div>
  </Link>
);

export default Page;
