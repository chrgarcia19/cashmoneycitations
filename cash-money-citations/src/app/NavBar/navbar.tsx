import "../../../css/style.css";
import "../../../css/form.css";
import Link from "next/link";
import { SignOut } from "@/components/AuthButtons";

function NavBar() {
    return (
        <>
        <div className="top-bar">
        <div className="nav">
          <Link href="/">Home</Link>
          <Link href="/new">Add Reference</Link>
          <Link href="/login">Login</Link>
          <SignOut />
        </div>

        <img
          id="title"
          src="data:image/png;base64,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"
          alt="Cashmoneycitations logo"
        ></img>
      </div>

        </>

    )
}

export default NavBar;