"use client"
// components/GuestAccess.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Avatar, Tooltip } from '@nextui-org/react';

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
      <Tooltip
      content="Guest User"
      className='dark:text-white'>
        <Avatar
          isBordered
          as="button"
          onClick={handleGuestAccess}
          className="transition-transform"
          color="secondary"
          size="lg"
          showFallback
        />
      </Tooltip>
    </div>
  );
};

export default GuestAccess;
