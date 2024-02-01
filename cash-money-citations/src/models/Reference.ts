import mongoose from "mongoose";

export interface References extends mongoose.Document {
    type: string;
    citekey: string;
    title: string;
    authorFirstName: string;
    authorLastName: string;
    authorMiddleInitial: string;
    publisher: string;
    year: string;
    month: string;
    address: string;
    edition: string;
    volume: string;
    isbn: string;
    doi: string;
    pages: string;
    journal: string;
    image_url: string;
}

//Schema to correspond the model to what is happening in MongoDB
const ReferenceSchema = new mongoose.Schema<References>({
  type: {
    type: String,
    required: [true, "Please provide a type for this reference."],
  },
  citekey: {
    type: String,
    required: [true, "Please provide the citekey for this reference."],
  },
  title: {
    type: String,
    required: [true, "Please provide the title."],
  },
  authorFirstName: {
    type: String,
    required: [true, "Please provide the first name of the author."],
  },
  authorLastName: {
    type: String,
    required: [true, "Please provide the last name of the author."],
  },
  authorMiddleInitial: {
    type: String,
  },
  publisher: {
    type: String,
    required: [true, "Please provide the publisher."],
  },
  year: {
    type: String,
    required: [true, "Please provide the year."],
  },
  month: {
    type: String,
  },
  address: {
    type: String,
  },
  edition: {
    type: String,
  },
  volume: {
    type: String,
  },
  isbn: {
    type: String,
  },
  doi: {
    type: String,
  },
  pages: {
    type: String,
  },
  journal: {
    type: String,
  },
  image_url: {
    type: String,
    required: [true, "Please provide the image URL."],
  },
});

export default mongoose.models.Reference || mongoose.model<References>("Reference", ReferenceSchema);
