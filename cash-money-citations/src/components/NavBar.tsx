import "../../css/style.css";
import "../../css/form.css";
import Link from "next/link";
import { SignOut } from "@/components/AuthButtons";
import { getServerAuthSession } from "@/lib/auth";

export default async function NavBar() {
  const authSession = await getServerAuthSession();
  
  return(
    <div className="navbar bg-blue-800 fixed top-0 z-50">
    <Link className="linkBtn inline-block rounded-full tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200" href="/">
      <img 
        className="cursor-pointer me-3"
        id="Logo"
        src="cashmoneycitations_logo.png"
        alt="Cash Money Citations Logo"
        width={80}
      >
      </img>
    </Link>
    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">Cash Money Citations</span>
    <div className="flex-1">
    </div>
    <div className="nav">
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
          <li><a>Settings</a></li>
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
{/*<>
<div className="navbar bg-blue-800 fixed top-0 z-50 w-full h-24 bg-white border-b border-gray-200 dark:bg-blue-800 dark:border-gray-700">
  <div className="px-3 py-3 lg:px-5 lg:pl-3">
    <div className="flex items-center justify-between">
        <div className="flex items-center">
            <Link className="linkBtn inline-block rounded-full tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200" href="/">
            <img 
                src="cashmoneycitations_logo.png"
                alt="Cash Money Citations Logo" 
                width={80}
                className="me-5"
                />
            </Link>
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Cash Money Citations</span>
        </div>
        
        </div>
    </div>
    <div className="object-right-top">
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
                    {/* Checks to see if the user is logged in *//*}
                    {!authSession?.user && (
                        <Link href="/login">Login</Link>
                    )}
                </li>
                <li>
                    {/* Checks to see if user is an admin *//*}
                    {authSession?.user?.role === "admin" && (
                        <Link href="/admin">Admin</Link>
                    )}
                </li>
                <li><a>Settings</a></li>
                <li>
                    {/* Checks to see if the user is logged in *//*}
                    {authSession?.user && (
                        <SignOut />
                    )}
                </li>
            </ul>
        </div>  
    </div>
</div>
                    </>*/}
}
