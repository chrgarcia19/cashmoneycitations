import React from "react";
import { Metadata } from 'next';
import '../../'
// Manages <head> HTML elements for built in SEO support
export const metadata: Metadata = {
    title: 'Home',
    description: 'CashMoneyCitations'
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}