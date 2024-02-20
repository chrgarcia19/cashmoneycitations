import "../../../css/style.css";
import "../../../css/form.css";
import Link from "next/link";
import { SignOut } from "@/components/AuthButtons";
import { getServerAuthSession } from "@/lib/auth";

export default async function NavBar() {
  const authSession = await getServerAuthSession();
  const linkClass = "hover:bg-slate-950 text-white";

    return (
        <>
        <div className="top-bar bg-bankerblue">
        <div className="nav">
          
          <Link className={linkClass} href="/">Home</Link>

          {/* Checks for base 'user' role */}
          {authSession?.user?.role && (
            <>
              <Link className={linkClass} href="/new">Add Reference</Link>
              <SignOut />
            </>

          )}

          {/* Checks to see if the user is logged in */}
          {!authSession?.user && (
            <Link className={linkClass} href="/login">Login</Link>
          )}

          {/* Checks to see if user is an admin */}
          {authSession?.user?.role === "admin" && (
            <Link className={linkClass} href="/admin">Admin</Link>
          )}


        </div>

        <img
          id="title"
          src="cashmoney_logo.png"
          alt="Cash Money Citations logo"
        ></img>
      </div>

        </>

    )
}
