// nextauth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
// Define a role enum
export enum Role {
  user = "user",
  admin = "admin",
}

export enum AccountType {
  oauth = "oauth",
  credential = "credential"
}
// common interface for JWT and Session
interface IUser extends DefaultUser {
  role?: Role;
  accountType?: AccountType;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
