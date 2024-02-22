import "../../../css/style.css";
import "../../../css/form.css";
import Link from "next/link";
import { SignOut } from "@/components/AuthButtons";

function NavBar() {
    return (
        <>
        <div className="top-bar bg-blue-800">
        <div className="nav">

          <Link className="hover:bg-slate-950 text-white" href="/">Home</Link>
          <Link className="hover:bg-slate-950 text-white" href="/new">Add Reference</Link>
          <Link className="hover:bg-slate-950 text-white" href="/login">Login</Link>
          <SignOut />

        </div>

        <img
          id="title"
          src="cashmoneycitations_logo.png"
          alt="Cash Money Citations logo"
        ></img>
      </div>

        </>

    )
}

export default NavBar;