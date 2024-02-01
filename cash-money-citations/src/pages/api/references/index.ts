import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Reference from "../../../models/Reference";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const references = await Reference.find({}); /* find all the data in our database */
        res.status(200).json({ success: true, data: references });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const reference = await Reference.create(
          req.body,
        ); /* create a new model in the database */
        res.status(201).json({ success: true, data: reference });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}