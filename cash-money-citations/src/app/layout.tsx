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
                <NavBar />
                <SideBar />
                <div className="content">
                    <AuthProvider>{children}</AuthProvider>
                </div>

                <footer className="fixed left-32 bottom-0 right-0 w-screen px-20 py-4 text-center text-sm text-gray-500 bg-gray-200">
                    <p>
                        Citation Styles created with help from the 
                        <a href="https://citationstyles.org/" 
                        className="text-blue-500 hover:underline hover:text-blue-700"> CSL (citation style language) project</a>
                    </p>
                    <p>
                        © {new Date().getFullYear()} Cash Money Citations. All rights reserved.
                    </p>
                </footer>
            </body>
        </html>
    )
}