import mongoose, { Mongoose } from "mongoose";
import { Contributor } from "../Contributor";

export interface DatabaseReference extends mongoose.Document {
    type: string;
    citekey: string;
    image_url: string;
    source_title: string;
    issn: string;
    contributors: Contributor[];
    month_accessed: string;
    day_accessed: string;
    year_accessed: string;
    month_published: string;
    day_published: string;
    year_published: string;
    library: string;
    city: string;
    database: string;
    database_url: string;
    service: string;
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

const DatabaseSchema = new mongoose.Schema<DatabaseReference>({
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
    issn: {
        type: String,
    },
    library: {
        type: String,
    },
    city: {
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
    database: {
        type: String,
    },
    database_url: {
        type: String,
    },
    service: {
        type: String,
    },
}, {timestamps: true});

export default mongoose.models.DatabaseReference || mongoose.model<DatabaseReference>("DatabaseReference", DatabaseSchema, "references");