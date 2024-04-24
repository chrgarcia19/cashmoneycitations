"use client"

import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  guest: boolean;
  exp: number;
}

export const useAccessControl = () => {
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem('guestToken') || sessionStorage.getItem('userToken');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        if (decoded.exp > Date.now() / 1000) {
          setIsGuest(decoded.guest);
          setHasAccess(true);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return { isGuest, hasAccess };
};
