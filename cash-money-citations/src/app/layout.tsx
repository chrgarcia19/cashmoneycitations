import React, { Suspense } from "react";
import { Metadata } from 'next';
import NavBar from '../components/NavBar';
import { AuthProvider } from "./Providers"
import SideBar from "@/components/SideBar";

// Manages <head> HTML elements for built in SEO support
export const metadata: Metadata = {
    title: 'Home',
    description: 'CashMoneyCitations'
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" data-theme="light">
            <body>
                <Suspense>
                    <NavBar />
                    <SideBar />
                    <div className="content">
                        <AuthProvider>{children}</AuthProvider>
                    </div>
                </Suspense>
            </body>
        </html>
    )
}