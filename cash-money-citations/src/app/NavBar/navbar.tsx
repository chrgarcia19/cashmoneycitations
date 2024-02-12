import "../../../css/style.css";
import "../../../css/form.css";
import Link from "next/link";

function NavBar() {
    return (
        <>
        <div className="top-bar bg-bankerblue">
        <div className="nav">
          <Link className="hover:bg-slate-950 text-white" href="/">Home</Link>
          <Link className="hover:bg-slate-950 text-white" href="/new">Add Reference</Link>
          <Link className="hover:bg-slate-950 text-white" href="/login">Login</Link>
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

export default NavBar;