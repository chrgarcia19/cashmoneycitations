import mongoose, { Mongoose } from "mongoose";
import { Contributor } from "../Contributor";

export interface WebReference extends mongoose.Document {
    type: string;
    citekey: string;
    image_url: string;
    contributors: Contributor[];
    source_title: string;
    website_title: string;
    website_url: string;
    month_accessed: string;
    day_accessed: string;
    year_accessed: string;
    month_published: string;
    day_published: string;
    year_published: string;
    publisher: string;
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

const WebSchema = new mongoose.Schema<WebReference>({
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
    website_title: {
        type: String,
    },
    website_url: {
        type: String,
    },
    month_accessed: {
        type: String,
    },
    day_accessed: {
        type: String,
    },
    year_accessed: {
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
}, {timestamps: true});

export default mongoose.models.WebReference || mongoose.model<WebReference>("WebReference", WebSchema, "references");