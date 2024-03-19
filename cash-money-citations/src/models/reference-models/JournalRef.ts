import mongoose from "mongoose";
import { Contributor } from "../Contributor";

export interface JournalReference extends mongoose.Document {
    type: string;
    citekey: string;
    image_url: string;
    source_title: string;
    journal_title: string;
    volume: string;
    issue: string;
    contributors: Contributor[];
    month_published: string;
    day_published: string;
    year_published: string;
    start_page: string;
    end_page: string;
    doi: string;
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

const JournalSchema = new mongoose.Schema<JournalReference>({
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
    journal_title: {
        type: String,
    },
    volume: {
        type: String,
    },
    issue: {
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
    doi: {
        type: String,
    },
    issn: {
        type: String,
    },
}, {timestamps: true});

export default mongoose.models.JournalReference || mongoose.model<JournalReference>("JournalReference", JournalSchema, "references");