"use client";

import {
  signOut,
} from "next-auth/react";



export function SignOut() {
  return (
    <button className="hover:bg-slate-950 text-white" onClick={() => signOut()} type="button">
      Sign Out
    </button>
  );
}