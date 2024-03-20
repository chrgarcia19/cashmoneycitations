import mongoose, { Schema } from 'mongoose';
import { Contributor } from "./Contributor";

function generateCiteKey() {
  return String(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
}

const ContributorSchema = new mongoose.Schema<Contributor>({
    // Define Contributor schema fields
    role: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    middleName: {
      type: String
    },
    suffix: {
      type: String
    }
});

const referencesUsedSchema = new mongoose.Schema({
  referenceId: String,
  doiAssertedBy: String,
  firstPage: String,
  doi: String,
  volume: String,
  author: String,
  year: String,
  journalTitle: String
})


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
    website_title: String,
    chapter: String,
    edition: String,
    editor: String,
    howpublished: String,
    institution: String, 
    journal: String, //Journal Title
    date: Date, //Date Published
    urldate: Date, //Date Accessed
    eventdate: Date,
    origdate: Date,
    month: String,
    year: String,
    note: String,
    number: Number,
    organization: String,
    pages: String,
    publisher: String,
    school: String,
    series: String,
    title: [String],
    type: String,
    volume: String,
    doi: String,
    issn: [String],
    issnType: [Object],
    isbn: String,
    url: String,
    cslJson: Object,
    image_url: String,
    issue: String,
    abstract: String,
    apiSource: String,
    subject: [String],
    referencesUsed: [referencesUsedSchema],
    citationIdList: [String]

}, {timestamps: true});

export default mongoose.models.CSLBibModel || mongoose.model("CSLBibModel", CSLBibSchema); 