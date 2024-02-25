"use client";
import { FaGithubSquare } from "react-icons/fa";

import {
  ClientSafeProvider,
  LiteralUnion,
  signIn,
  signOut,
} from "next-auth/react";
import { Suspense } from "react";

interface IProps {
  providers: Record<LiteralUnion<string, string>, ClientSafeProvider>;
}


export function SignInGitHub({ providers }: IProps) {
  const provider = providers.github;
  return (
    <>
      {provider && (
        <button onClick={() => signIn(provider.id)} type="button">
          <FaGithubSquare className="mr-2" />
          {provider.name}
        </button>
      )}
    </>
  );
}

export function SignOut() {
  return (
    <button onClick={() => signOut()} type="button">
      Logout
    </button>
  );
}