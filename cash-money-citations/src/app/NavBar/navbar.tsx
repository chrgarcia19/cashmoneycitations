import "../../../css/style.css";
import "../../../css/form.css";
import Link from "next/link";

function NavBar() {
    return (
        <>
        <div className="top-bar">
        <div className="nav">
          <Link href="/">Home</Link>
          <Link href="/new">Add Pet</Link>
          <Link href="/login">Login</Link>
        </div>

        <img
          id="title"
          src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
          alt="pet care logo"
        ></img>
      </div>

        </>

    )
}

export default NavBar;