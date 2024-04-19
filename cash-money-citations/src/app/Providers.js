"use client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

export const AuthProvider = ({ children }) => {
    return (
        <SessionProvider>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </SessionProvider>
    )
};


export default function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <ThemeProvider  attribute="class" themes={['pink', 'red', 'blue', 'light', 'dark']}>{children}</ThemeProvider>;
}
