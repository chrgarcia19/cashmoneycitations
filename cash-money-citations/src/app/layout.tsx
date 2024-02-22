import React from "react";
import { Metadata } from 'next';
import NavBar from '../app/NavBar/navbar';

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
        <html data-theme="light" lang="en">
            <body>
                <NavBar />
                <div className="reference-wrapper">
                    {children}
                </div>
            </body>
        </html>
    )
}