"use client";
import { FaGithubSquare } from "react-icons/fa";
import {FcGoogle} from 'react-icons/fc'

import {
  ClientSafeProvider,
  LiteralUnion,
  signIn,
  signOut,
} from "next-auth/react";

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

export function SignInGoogle({ providers }: IProps) {
  const provider = providers.google;
  return (
    <>
      {provider && (
        <button onClick={() => signIn(provider.id)} type="button">
          <FcGoogle className="mr-2" />
          {provider.name}
        </button>
      )}
    </>
  );
}

export function SignOut() {
  return (
    <button className="hover:bg-slate-950 text-white" onClick={() => signOut()} type="button">
      Sign Out
    </button>
  );
}