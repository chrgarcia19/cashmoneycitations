import mongoose, { Mongoose } from "mongoose";
import { Contributor } from "../Contributor";

export interface BookReference extends mongoose.Document {
    type: string;
    citekey: string;
    image_url: string;
    source_title: string;
    volume: string;
    edition: string;
    contributors: Contributor[];
    month_published: string;
    day_published: string;
    year_published: string;
    publisher: string;
    city: string;
    state: string;
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

const BookSchema = new mongoose.Schema<BookReference>({
    type: {
        type: String,
    },
    citekey: {
        type: String,
    },
    image_url: {
        type: String,
    },
    contributors: [ContributorSchema],
    source_title: {
        type: String,
    },
    volume: {
        type: String,
    },
    edition: {
        type: String,
    },
    month_published: {
        type: String,
    },
    day_published: {
        type: String,
    },
    year_published: {
        type: String,
    },
    publisher: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
});

export default mongoose.models.BookReference || mongoose.model<BookReference>("BookReference", BookSchema, "references");