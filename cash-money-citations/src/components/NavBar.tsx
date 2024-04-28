import "../../css/style.css";
import "../../css/form.css";
import Link from "next/link";
import { SignOut } from "../components/AuthButtons";
import { getServerAuthSession } from "../lib/auth";
import GuestAccess from '../components/GuestAccess'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Image} from "@nextui-org/react";
import ThemeSwitcher from "../app/ThemeSwitcher";
import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import SideBar from "./SideBar";
import AvatarDropdown from "./AvatarDropdown";

export default async function NavBar() {
  const authSession = await getServerAuthSession() ?? undefined;
  
  return(
    <Navbar 
      isBordered 
      maxWidth="full"
      className="bg-primary"
      >
      
      <NavbarBrand>
        {authSession?.user && (
          <SideBar />
        ) || (      
          <>
            <Link className="linkBtn inline-block gap-4 rounded-full tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200"
              href="/">
              <div className="flex items-center">
                <Image
                  src={"cashmoneycitations_logo.png"}
                  alt="Cash Money Citations Logo"
                  width={65} />
              </div>
            </Link>
            <span className="pl-2 self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">Cash Money Citations</span>
          </>
        )}
      </NavbarBrand>
      <NavbarContent as="div" justify="end">
          <AvatarDropdown session={authSession}/>
      </NavbarContent>
    </Navbar>
  )
}
