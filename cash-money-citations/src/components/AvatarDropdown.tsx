'use client'
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

type Props = {
    session?: Session;
}

export default function AvatarDropdown(props: Props){

    const hideAdmin = (props.session?.user?.role !== "admin" ? true : false);
    const hideLogin = (props.session?.user ? true : false);
    const hideLogout = (!props.session?.user ? true : false);

    let disabled = new Array();
    if (hideAdmin) {disabled.push("admin")}
    if (hideLogin) {disabled.push("login")}
    if (hideLogout) {disabled.push("logout")}
  
    console.log(disabled)

    return (
      <>
        <Dropdown placement="bottom-end" className="dark:text-white">
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
            disabledKeys={disabled}>
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{props.session?.user?.email}</p>
            </DropdownItem>
            <DropdownItem key="login" color="success" href="/login">
              Login
            </DropdownItem>
            <DropdownItem key="admin" href="/admin">
              Admin Dashboard
            </DropdownItem>
            <DropdownItem key="settings">User Settings</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={() => signOut({ callbackUrl: '/login'})}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </>
    )
}