// hooks/useUser.ts
import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'

interface DecodedToken {
  guest: boolean;
  exp: number;
}

export const useUser = () => {
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem('guestToken');
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.guest && decoded.exp > Date.now() / 1000) {
        setIsGuest(true);
      }
    }
  }, []);

  return { isGuest };
};
