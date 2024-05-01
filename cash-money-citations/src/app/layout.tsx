import React from "react";
import NavBar from "../components/NavBar";
import { AuthProvider } from "./Providers";
import SideBar from "../components/SideBar";
import Providers from "./Providers";
import { ReferenceProvider } from "./reference-table/components/ReferenceTable";
import { ThemeProvider } from "next-themes";

// Manages <head> HTML elements for built-in SEO support
export const metadata = {
  title: 'Cash Money Citations',
  description: 'CashMoneyCitations',
  icons: 'cashmoneycitations_logo.png'
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  
  return (
    <html lang="en">
      <body className="flex flex-col justify-between min-h-screen bg-gray-100 dark:bg-gray-800">
        
        <Providers>
          <AuthProvider>
          <NavBar />
            <ReferenceProvider>
              <ThemeProvider attribute="class">
                <main className="flex-grow">
                  <div className="ml-24 min-h-full">
                    <div className="p-2">{children}</div>
                  </div>
                </main>
              </ThemeProvider>
            </ReferenceProvider>
          </AuthProvider>

          <footer className="w-full px-4 py-4 text-center text-sm bg-gray-400 sm:px-6 md:px-20 dark:bg-gray-700 text-white">
            <p>
              Citation Styles created with help from the
              <a href="https://citationstyles.org/" className="text-blue-500 hover:underline hover:text-blue-700">
                CSL (citation style language) project
              </a>
            </p>
            <p>© {new Date().getFullYear()} Cash Money Citations. All rights reserved.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
