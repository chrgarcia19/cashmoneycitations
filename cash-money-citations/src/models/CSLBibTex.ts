import mongoose, { Schema } from 'mongoose';
import { Contributor } from "./Contributor";
import User from './User';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { Tag } from './Tag';


async function getUserId() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ?? '';
  return userId;
}

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

interface ReferencesUsed {
  referenceId: String,
  doiAssertedBy: String,
  firstPage: String,
  doi: String,
  volume: String,
  author: String,
  year: String,
  journalTitle: String
}

export interface CSLBibInterface extends mongoose.Document {
  entryType: "article" | "article-journal" | "article-magazine" | "article-newspaper" | "bill" | "book" | "broadcast" | "chapter" | "classic" | "collection" | "dataset" | "document" | "entry" | "entry-dictionary" | "entry-encyclopedia" | "event" | "figure" | "graphic" | "hearing";
    location: String, 
    annote: String, //annotation provided by a user
    contributors: Contributor[],
    chapter: String,
    edition: String,
    editor: String,
    howpublished: String,
    institution: String, 
    indextitle: String, // Title of a website, journal, etc.
    /*The next 3 fields are for 
    displaying/editing data for a date*/
    month_published: String,
    day_published: String,
    year_published: String,
    date: Date, //Date Published
    /*The next 3 fields are for 
    displaying/editing data for a date*/
    month_accessed: String,
    day_accessed: String,
    year_accessed: String,
    urldate: Date, //Date Accessed
    /*The next 3 fields are for 
    displaying/editing data for a date*/
    month_event: String,
    day_event: String,
    year_event: String,
    eventdate: Date, //Date event occurred (ex: conference)
    note: string,
    number: number,
    organization: string,
    pages: string,
    publisher: string,
    school: string,
    series: string,
    volumes: number,
    shorttitle: string,
    title: string[],
    type: string,
    volume: string,
    doi: string,
    issn: string[],
    issnType: object[],
    isbn: string,
    url: string,
    runningTime: string,
    format: string,
    cslJson: object,
    image_url: string,
    issue: string,
    abstract: string,
    apiSource: string,
    subject: string[],
    referencesUsed: ReferencesUsed[],
    citationIdList: string[],
    isOwnedBy: string[],
    tagID: string[],
}

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
    location: String,
    annote: String,
    contributors: [ContributorSchema],
    chapter: String,
    edition: String,
    editor: String,
    howpublished: String,
    institution: String, 
    indextitle: String, //Journal Title
    /*The next 3 fields are for 
    displaying/editing data for a date*/
    month_published: String,
    day_published: String,
    year_published: String,
    date: Date, //Date Published
    /*The next 3 fields are for 
    displaying/editing data for a date*/
    month_accessed: String,
    day_accessed: String,
    year_accessed: String,
    urldate: Date, //Date Accessed
    /*The next 3 fields are for 
    displaying/editing data for a date*/
    month_event: String,
    day_event: String,
    year_event: String,
    eventdate: Date,
    month: String,
    year: String,
    note: String,
    number: Number, //Issue Number for Journal
    organization: String,
    pages: String,
    publisher: String,
    school: String,
    series: String,
    volumes: Number,
    shorttitle: String,
    title: [String],
    type: String,
    volume: String,
    doi: String,
    issn: [String],
    issnType: [Object],
    isbn: String,
    url: String, //Website URL
    runningTime: String,
    format: String,
    cslJson: Object,
    image_url: String,
    issue: String,
    abstract: String,
    apiSource: String,
    subject: [String],
    referencesUsed: [referencesUsedSchema],
    citationIdList: [String],
    isOwnedBy: [String],
    tagID: [String],

}, {timestamps: true});

CSLBibSchema.pre('save', async function (next) {
  const reference = this as CSLBibInterface;
  const userId = await getUserId();

  // Retrieve the owner of the reference
  const owner = await User.findById(userId).select('ownedReferences');

  // If the owner doesn't exist or the reference is not in the owner's list of ownedReferences, invalidate the document
  if (!owner || !owner.ownedReferences.includes(reference._id)) {
    this.invalidate('owner', 'Owner not found or does not own this reference');
  }

  next();
});

export default mongoose.models.CSLBibModel || mongoose.model("CSLBibModel", CSLBibSchema); 