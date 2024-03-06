import mongoose, { Schema } from 'mongoose';
import { Contributor } from "./Contributor";

function generateCiteKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
const BibTexSchema = new Schema({
    entryType: {
        type: String,
        enum: [
            'article',
            'book',
            'booklet',
            'conference',
            'inbook',
            'incollection',
            'inproceedings',
            'manual',
            'masterthesis',
            'misc',
            'phdthesis',
            'proceedings',
            'techreport',
            'unpublished',
        ]
    },
    citeKey: {
      type: String,
      default: generateCiteKey
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
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.BibTexModel || mongoose.model("BibTexModel", BibTexSchema); 