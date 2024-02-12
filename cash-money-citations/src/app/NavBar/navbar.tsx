import "../../../css/style.css";
import "../../../css/form.css";
import Link from "next/link";

function NavBar() {
    return (
        <>
        <div className="top-bar bg-slate-800">
        <div className="nav">
          <Link className="hover:bg-slate-950 text-white" href="/">Home</Link>
          <Link className="hover:bg-slate-950 text-white" href="/new">Add Reference</Link>
          <Link className="hover:bg-slate-950 text-white" href="/login">Login</Link>
        </div>

        <img
          id="title"
          src="https://cdn.iconscout.com/icon/free/png-256/free-cashapp-3244513-2701881.png"
          alt="Cashmoneycitations logo"
        ></img>
      </div>

        </>

    )
}

export default NavBar;