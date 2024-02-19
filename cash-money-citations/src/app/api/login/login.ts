// import { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import dbConnect from "../../../utils/dbConnect";
// import User from "../../../models/User";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { method } = req;

//   await dbConnect();

//   switch (method) {
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
//       res.status(400).json({ success: false });
//       break;
//   }
// }