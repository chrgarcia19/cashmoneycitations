"use client"
// components/GuestAccess.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';
import { useSession } from "next-auth/react";
import { Tooltip } from 'react-tooltip'

const GuestAccess: React.FC = () => {
  const [statusGuest, setStatusGuest] = useState<string>('');
  const router = useRouter();
  const { data: session, status } = useSession(); // Use useSession to access the session

  const handleGuestAccess = async (): Promise<void> => {
    const response = await fetch('/api/guest_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const guestTokenData = await response.json();
      // console.log(data, "data")
      sessionStorage.setItem('guestToken', guestTokenData.data);
      setStatusGuest('Guest session active. You have limited access.');
      router.push('/guest/access');
    } else {
      setStatusGuest('Failed to initiate guest session.');
    }
  };

  if (status === "authenticated") {
    return null;
  }


  return (
    <div>
      <button className="" onClick={handleGuestAccess}>
      <FaUser className="text-white text-3xl my-anchor-element" size={34}/>
      </button>
      <Tooltip anchorSelect=".my-anchor-element" place="top">
  Guest User
</Tooltip>
      {/* <p className="mt-2">{status}</p> */}
    </div>
  );
};

export default GuestAccess;
