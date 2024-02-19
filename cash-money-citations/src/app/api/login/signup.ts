// import { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from 'bcryptjs';
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

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const user = new User({
//             username,
//             password: hashedPassword,
//         });

//         // Save the user to the database
//         await user.save();

//         res.status(201).json({ message: 'User registered successfully' });
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