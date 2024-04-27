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

export default async function NavBar() {
  const authSession = await getServerAuthSession();
  
  
  return(
    <Navbar 
      isBordered 
      maxWidth="full"
      >
      
      <NavbarBrand>
        <Button 
          color="primary" 
          radius="full"
          fullWidth={false}
          startContent={
            <Image 
            src={"cashmoneycitations_logo.png"}
            alt="Cash Money Citations Logo"
            width={55}
          />
          }
          endContent={
            <IoMdArrowDropdown />
          }
          aria-label="Navigation Dropdown">
        </Button>
      </NavbarBrand>
    </Navbar>
  )
}
