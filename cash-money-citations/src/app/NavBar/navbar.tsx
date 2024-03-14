import "../../../css/style.css";
import "../../../css/form.css";
import Link from "next/link";
import { SignOut } from "@/components/AuthButtons";
import { getServerAuthSession } from "@/lib/auth";
import LinkBtn from "@/components/LinkBtn";
import User from "@/models/User";

export default async function NavBar() {
  const authSession = await getServerAuthSession();
  return(
  <div className="navbar bg-blue-800">
    <Link className="linkBtn inline-block rounded-full tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200" href="/">
      <img 
        className="cursor-pointer"
        id="Logo"
        src="cashmoneycitations_logo.png"
        alt="Cash Money Citations Logo"
        width={80}
      >
      </img>
    </Link>
    <div className="flex-1">
    </div>
    <div className="nav">
      {/* Checks for base 'user' role */}
      {authSession?.user?.role && (
        <>
          <LinkBtn linkData="/new" text="Add Reference" />
          <LinkBtn linkData="/reference-gallery" text="Gallery"  />
          <LinkBtn linkData="/reference-table" text="Table"  />
          <LinkBtn linkData="/input-doi" text="DOI Input" />
        </>
      )}
    </div>
    <div className="flex-none gap-2 pr-4">
      <div className="dropdown dropdown-end">
        {authSession?.user?.image && (
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={authSession?.user?.image} alt="User" />
              </div>
            </div>
          ) || (
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
              <div className="w-32 rounded-full bg-teal-300 ring ring-primary ring-offset-base-100 ring-offset-2">
                <span className="font-bold">User</span>
              </div>
            </div>
          )} 
        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li>
              {/* Checks to see if the user is logged in */}
              {!authSession?.user && (
                <Link href="/login">Login</Link>
              )}
          </li>
          <li>
              {/* Checks to see if user is an admin */}
              {authSession?.user?.role === "admin" && (
                <Link href="/admin">Admin</Link>
              )}
          </li>
          <li>
              {/* Checks user account type and removes settigs for OAuth */}

              {authSession?.user?.accountType !== "oauth" && (
                <Link href={{ pathname: `/profile/${authSession?.user?.id}`, query: { id: authSession?.user?.id} }}>Settings </Link>

              )}
          </li>
          <li>
              {/* Checks to see if the user is logged in */}
              {authSession?.user && (
                <SignOut />
              )}
          </li>
        </ul>
      </div>
    </div>
  </div>
  )
}
