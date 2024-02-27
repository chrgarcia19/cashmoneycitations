"use client";

import {
  signOut,
} from "next-auth/react";
import { Suspense } from "react";



export function SignOut() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/login'})} type="button">
      Logout
    </button>
  );
}