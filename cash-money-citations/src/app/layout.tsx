import React, { Suspense } from "react";
import { Metadata } from "next";
import NavBar from "../components/NavBar";
import { AuthProvider } from "./Providers";
import SideBar from "../components/SideBar";
import Providers from "./Providers";

// Manages <head> HTML elements for built in SEO support
export const metadata: Metadata = {
  title: "Home",
  description: "CashMoneyCitations",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Providers>
          <NavBar />
          
          <AuthProvider>
            <div className="bg-gray-100 dark:bg-gray-800 grid grid-cols-12">
              <div className="col-span-1"><SideBar /></div>
              <div className="col-span-11 mt-32">{children}</div>
            </div>
          </AuthProvider>

          {/* <IconSidebar/> */}

          <footer className="w-full px-4 py-4 text-center text-sm bg-gray-200 sm:px-6 md:px-20 dark:bg-gray-700 text-white">
            <p>
              Citation Styles created with help from the
              <a
                href="https://citationstyles.org/"
                className="text-blue-500 hover:underline hover:text-blue-700"
              >
                {" "}
                CSL (citation style language) project
              </a>
            </p>
            <p>
              © {new Date().getFullYear()} Cash Money Citations. All rights
              reserved.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
