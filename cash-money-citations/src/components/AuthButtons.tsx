"use client";
import { FaGithubSquare } from "react-icons/fa";

import {
  ClientSafeProvider,
  LiteralUnion,
  signIn,
  signOut,
} from "next-auth/react";

interface IProps {
  providers: Record<LiteralUnion<string, string>, ClientSafeProvider>;
}


export function SignIn({ providers }: IProps) {
  return Object.values(providers).map((provider) => (
      <button
        onClick={() => signIn(provider.id)}
        type="button"
      >
        <FaGithubSquare className="mr-2" />

        {provider.name}
      </button>
  ));
}

export function SignOut() {
  return (
    <button onClick={() => signOut()} type="button">
      Sign Out
    </button>
  );
}