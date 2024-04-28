'use client'
import { Image, Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { Session } from "next-auth";
import Link from "next/link";
import { SignOut } from "./AuthButtons";

type Props = {
    session?: Session;
}

export default function AvatarDropdown(props: Props){

    const hideAdmin = (props.session?.user?.role !== "admin" ? true : false);
  
    console.log(hideAdmin)
    return (
      <>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              size="lg"
              src={props.session?.user?.image ?? undefined}
              showFallback
            />
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Profile Actions" 
            variant="flat"
            disabledKeys={hideAdmin ? ["admin"] : []}>
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{props.session?.user?.email}</p>
            </DropdownItem>
            <DropdownItem key="admin" href="/admin">
              Admin Dashboard
            </DropdownItem>
            <DropdownItem key="settings">User Settings</DropdownItem>
            <DropdownItem key="logout" color="danger">
              {/* Checks to see if the user is logged in */}
              {props.session?.user && (
                <SignOut />
              )}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </>
    )
}