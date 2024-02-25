import "../../../css/style.css";
import "../../../css/form.css";
import Link from "next/link";
import { SignOut } from "@/components/AuthButtons";
import { getServerAuthSession } from "@/lib/auth";
import { Suspense } from "react";

export default async function NavBar() {
  const authSession = await getServerAuthSession();
  const linkClass = "hover:bg-slate-950 text-white";

  return(
  <div className="navbar bg-blue-800">
    <Link className={linkClass} href="/">
      <img 
        className="cursor-pointer"
        id="Logo"
        src="cashmoneycitations_logo.png"
        alt="Cash Money Citations Logo"
        width={90}
      >
      </img>
    </Link>
    <div className="flex-1">
    </div>
    <div className="nav">
      {/* Checks for base 'user' role */}
      {authSession?.user?.role && (
        <>
          <Link className={linkClass} href="/new">Add Reference</Link>
          <Link className="hover:bg-slate-950 text-white" href="/input-doi">DOI Input</Link>
        </>
      )}
    </div>
    <div className="flex-none gap-2 pr-4">
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li>
            <a className="justify-between">
              {/* Checks to see if the user is logged in */}
              {!authSession?.user && (
                <Link href="/login">Login</Link>
              )}
            </a>
          </li>
          <li>
            <a className="justify-between">
              {/* Checks to see if user is an admin */}
              {authSession?.user?.role === "admin" && (
                <Link href="/admin">Admin</Link>
              )}
            </a>
          </li>
          <li><a>Settings</a></li>
          <li>
            <a className="justify-between">
              {/* Checks to see if the user is logged in */}
              {authSession?.user && (
                <SignOut />
              )}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  )
    /*return (
      <>
        <div className="navbar bg-blue-800 h-25 w-full shadow-xl">  
          <div className="nav flex items-center h-full w-full">
            <Link className={linkClass} href="/">
              <img 
                className="cursor-pointer"
                id="Logo"
                src="cashmoneycitations_logo.png"
                alt="Cash Money Citations Logo"
                width={100}
                height={100}
              >
              </img>
            </Link>
            <div className="absolute right-6">
              {/* Checks for base 'user' role *///}
              /*{authSession?.user?.role && (
                <>
                  <ul className="hidden sm:flex">
                    <Link className={linkClass} href="/new">
                      <li className="hover:border-b text-xl">Add Reference</li>
                    </Link>
                    <Link className="hover:bg-slate-950 text-white" href="/input-doi">
                      <li className="hover:border-b text-xl">DOI Input</li>
                    </Link>
                    <SignOut />
                  </ul>
                </>

              )}

              {/* Checks to see if the user is logged in *///}
              /*{!authSession?.user && (
                <ul className="hidden sm:flex">
                  <Link className={linkClass} href="/login">
                    <li className="hover:border-b text-xl">Login</li>
                  </Link>
                </ul>
              )}

              {/* Checks to see if user is an admin *///
              /*{authSession?.user?.role === "admin" && (
                <ul className="hidden sm:flex">
                  <Link className={linkClass} href="/admin">
                    <li className="hover:border-b text-xl">Admin</li>
                  </Link>
                </ul>
                
              )}

              <div className="avatar placeholder">
                <div className="bg-neutral-400 text-center rounded-full w-8 ">
                  <span className="text-2xl">D</span>
                </div>
              </div> 
            </div>
          </div>
      </div>

        </>
    )*/
}
