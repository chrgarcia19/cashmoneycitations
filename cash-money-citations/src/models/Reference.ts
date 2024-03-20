import mongoose from "mongoose";
import { Contributor } from "./Contributor";
import { StringLiteral } from "typescript";

export interface References extends mongoose.Document {
    type: string;
    citekey: string;
    title: string;
    contributors: Contributor[];
    month_published: string;
    day_published: string;
    year_published: string;
    publisher: string;
    image_url: string;
}

const ContributorSchema = new mongoose.Schema<Contributor>({
  role: {
    type: String,
  },
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  suffix: {
    type: String,
  },
});

//Schema to correspond the model to what is happening in MongoDB
const ReferenceSchema = new mongoose.Schema<References>({
  type: {
    type: String,
    // required: [true, "Please provide a type for this reference."],
  },
  citekey: {
    type: String,
    // required: [true, "Please provide the citekey for this reference."],
  },
  title: {
    type: String,
    // required: [true, "Please provide the title."],
  },
  contributors: [ContributorSchema],
  month_published: {
    type: String,
  },
  day_published: {
    type: String,
  },
  year_published: {
    type: String,
    // required: [true, "Please provide the year."],
  },
  publisher: {
    type: String,
    // required: [true, "Please provide the publisher."],
  },
  image_url: {
    type: String,
  },
});

export default mongoose.models.Reference || mongoose.model<References>("Reference", ReferenceSchema);