import React, { Suspense } from "react";
import { Metadata } from 'next';
import NavBar from '../app/NavBar/navbar';
import { AuthProvider } from "./Providers"

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
                <div className="reference-wrapper">
                    <AuthProvider>{children}</AuthProvider>
                </div>

                
                <footer className="px-20 py-4 text-center text-sm text-gray-500 bg-gray-200">
                    <p>
                        Citation Styles created with help from the  <a href="https://citationstyles.org/" className="text-blue-500 hover:underline hover:text-blue-700">CSL (citation style language) project</a>
                    </p>
                    <p>
                        © {new Date().getFullYear()} Cash Money Citations. All rights reserved.
                    </p>
                </footer>
            </body>
        </html>
    )
}