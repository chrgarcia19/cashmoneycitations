import mongoose, { Schema } from 'mongoose';
import { Contributor } from "./Contributor";

function generateCiteKey() {
  return String(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
}

const ContributorSchema = new mongoose.Schema<Contributor>({
    // Define Contributor schema fields
    contributorType: {
      type: String
    },
    contributorFirstName: {
      type: String
    },
    contributorLastName: {
      type: String
    },
    contributorMiddleI: {
      type: String
    }
});

// 3/6/24 Need to decide which fields are optional and which are required
// Each entry type has its own required fields
const CSLBibSchema = new Schema({
    entryType: {
        type: String,
        enum: [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
    },
    citekey: {
        type: String,
        default: generateCiteKey,
    },
    address: String,
    annote: String,
    contributors: [ContributorSchema],
    booktitle: String,
    chapter: String,
    edition: String,
    editor: String,
    howpublished: String,
    institution: String,
    journal: String,
    month: Date,
    note: String,
    number: Number,
    organization: String,
    pages: Number,
    publisher: String,
    school: String,
    series: String,
    title: String,
    type: String,
    volume: String,
    year: Date,
    doi: String,
    issn: String,
    isbn: String,
    url: String,
    cslJson: Object,
    dateCreated: {
        type: Date,
        default: Date.now
    },
    image_url: String
});

export default mongoose.models.CSLBibSchema || mongoose.model("CSLBibModel", CSLBibSchema); 