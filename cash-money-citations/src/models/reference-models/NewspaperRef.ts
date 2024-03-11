import mongoose from "mongoose";
import { Contributor } from "../Contributor";

export interface NewspaperReference extends mongoose.Document {
    type: string;
    citekey: string;
    image_url: string;
    source_title: string;
    newspaper_title: string;
    edition: string;
    section: string;
    city: string;
    contributors: Contributor[];
    month_published: string;
    day_published: string;
    year_published: string;
    start_page: string;
    end_page: string;
    issn: string;
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

const NewspaperSchema = new mongoose.Schema<NewspaperReference>({
    type: {
        type: String,
    },
    citekey: {
        type: String,
    },
    image_url: {
        type: String,
    },
    source_title: {
        type: String,
    },
    newspaper_title: {
        type: String,
    },
    edition: {
        type: String,
    },
    section: {
        type: String,
    },
    city: {
        type: String,
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
    },
    start_page: {
        type: String,
    },
    end_page: {
        type: String,
    },
    issn: {
        type: String,
    },
}, {timestamps: true});

export default mongoose.models.NewspaperReference || mongoose.model<NewspaperReference>("NewspaperReference", NewspaperSchema, "references");