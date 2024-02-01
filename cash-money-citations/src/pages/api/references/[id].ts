import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Reference from "../../../models/Reference";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const reference = await Reference.findById(id);
        if (!reference) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: reference });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const reference = await Reference.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!reference) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: reference });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedReference = await Reference.deleteOne({ _id: id });
        if (!deletedReference) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}