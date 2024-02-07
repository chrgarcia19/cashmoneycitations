import "../../css/style.css";
import "../../css/form.css";
import Link from "next/link";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>


      <div className="top-bar">
        <div className="nav">
          <Link href="/">Home</Link>
          <Link href="/new">Add Pet</Link>
        </div>

        <img
          id="title"
          src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
          alt="pet care logo"
        ></img>
      </div>
      <div className="wrapper grid">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;

// import { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import dbConnect from "../utils/dbConnect";
// import User from "../models/User";
// import Pet from "../models/Pet";


// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { method } = req;

//   await dbConnect();

//   switch (method) {
//     case "GET":
//       try {
//         const pets = await Pet.find({}); /* find all the data in our database */
//         res.status(200).json({ success: true, data: pets });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;
//     case "POST":
//       try {
//         const { username, password } = req.body;

//         // Find the user in the database
//         const user = await User.findOne({ username });

//         // If the user doesn't exist or the password is incorrect, send an error
//         if (!user || !await bcrypt.compare(password, user.password)) {
//           return res.status(400).json({ message: 'Invalid username or password' });
//         }

//         // Create a JWT
//         const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');

//         // Send the JWT to the client
//         res.status(200).json({ token });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//       }
//       break;
//     default:
  
//       break;
//   }
// }