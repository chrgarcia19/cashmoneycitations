"use client"
// components/GuestAccess.tsx
import React, { useState } from 'react';

const GuestAccess: React.FC = () => {
  const [status, setStatus] = useState<string>('');

  const handleGuestAccess = async (): Promise<void> => {
    const response = await fetch('/api/guest_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log(response, "response")
      const data = await response.json();
      sessionStorage.setItem('guestToken', data.guestToken);
      setStatus('Guest session active. You have limited access.');
    } else {
      setStatus('Failed to initiate guest session.');
    }
  };

  return (
    <div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleGuestAccess}>
        Access as Guest
      </button>
      <p className="mt-2">{status}</p>
    </div>
  );
};

export default GuestAccess;
