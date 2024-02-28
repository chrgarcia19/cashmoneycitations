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
                    <Suspense><AuthProvider>{children}</AuthProvider></Suspense>
                </div>
            </body>
        </html>
    )
}