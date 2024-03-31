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

const TagSchema = new mongoose.Schema<Tag>({
  tagName: String,
  tagColor: String,
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

export interface CSLGeneralFields {
  abstract?: string;
  annote?: string;
  archive?: string;
  archive_collection?: string;
  archive_location?: string;
  authority?: string;
  "call-number"?: string;
  "citation-key"?: string; // Identifier for input data file
  "citation-label"?: string; // Identifier for in-text citation
  "collection-title"?: string; // i.e. Series title for a book
  "container-title"?: string; // i.e. Book title for a book chapter, journal title for a journal article
  dimensions?: string;
  division?: string;
  DOI?: string;
  event?: string; // Legacy. New version is event-title
  "event-title"?: string;
  genre?: string;
  ISBN?: string;
  ISSN?: string;
  jurisdiction?: string;
  keyword?: string;
  language?: string;
  license?: string;
  medium?: string;
  note?: string;
  "original-publisher"?: string;
  "original-title"?: string;
  "part-title"?: string;
  PMCID?: string;
  PMID?: string;
  publisher?: string;
  references?: string[];
  "reviewed-genre"?: string;
  "reviewed-title"?: string;
  scale?: string;
  source?: string;
  status?: string;
  title: string[];
  URL?: string;
  "volume-title"?: string;
  "year-suffix"?: string;
  "chapter-number"?: number;
  "citation-number"?: number;
  "collection-number"?: number;
  edition?: number;
  "first-reference-note-number"?: number;
  issue?: number;
  locator?: number;
  number?: number;
  "number-of-pages"?: number;
  "number-of-volumes"?: number;
  page?: number;
  "page-first"?: number;
  "part-number"?: number;
  "printing-number"?: number;
  section?: number;
  "supplement-number"?: number;
  version?: number;
  volume?: number;

  /* Date fields */
  accessed: Date; // Date accessed
  "available-date": Date; // Date treaty was signed, or online publication date before formal publication
  "event-date": Date; // Date of event
  issued: Date; // Date published
  "original-date": Date; // Issue date of original version
  submitted: Date; // Date item was submitted for publication
}

export interface CSLBibInterface extends mongoose.Document, CSLGeneralFields {
  entryType: "article" | "article-journal" | "article-magazine" | "article-newspaper" | "bill" | "book" | "broadcast" | "chapter" | "classic" | "collection" | "dataset" | "document" | "entry" | "entry-dictionary" | "entry-encyclopedia" | "event" | "figure" | "graphic" | "hearing";
  contributors: Contributor[],
  /* Geographical location of archive (Will be converted into archive-place) */
  archivePlaceCity: string,
  archivePlaceCountry: string,
  /* Geographical location of event (Will be converted into event-place) */
  eventPlaceCity: string,
  eventPlaceCountry: string,
  /* Geographical location of Original publisher place (Will be converted into original-publisher-place) */
  origPubPlaceCity: string,
  origPubPlaceCountry: string,
  /* Geographical location of the current publisher place (Will be converted into publisher-place) */
  publisherPlaceCity: String,
  publisherPlaceCountry: String,
  datePublished: Date,
  dateAccessed: Date,
  dateEvent: Date,
  dateAvailable: Date,
  dateOriginal: Date,
  dateSubmitted: Date,

  type: string,
  runningTime: string,
  format: string,
  cslJson: object,
  image_url: string,
  apiSource: string,
  subject: string[],
  referencesUsed: ReferencesUsed[],
  citationIdList: string[],
  isOwnedBy: string[],
  tags: Tag[],
}

const CSLLocationSchema = new Schema({
  city: String,
  country: String,
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
  "archive-place": CSLLocationSchema,
  "event-place": CSLLocationSchema,
  "original-publisher-place": CSLLocationSchema,
  "publisher-place": CSLLocationSchema,
  abstract: String,
  annote: String,
  archive: String,
  archive_collection: String,
  archive_location: String,
  authority: String,
  "call-number": String,
  "citation-key": String,
  "citation-label": String,
  "collection-title": String,
  "container-title": String,
  dimensions: String,
  division: String,
  DOI: String,
  event: String,
  "event-title": String,
  genre: String,
  ISBN: String,
  ISSN: String,
  jurisdiction: String,
  keyword: String,
  language: String,
  license: String,
  medium: String,
  note: String,
  "original-publisher": String,
  "original-title": String,
  "part-title": String,
  PMCID: String,
  PMID: String,
  publisher: String,
  references: [String],
  "reviewed-genre": String,
  "reviewed-title": String,
  scale: String,
  source: String,
  status: String,
  title: [String],
  URL: String,
  "volume-title": String,
  "year-suffix": String,
  "chapter-number": Number,
  "citation-number": Number,
  "collection-number": Number,
  edition: Number,
  "first-reference-note-number": Number,
  issue: Number,
  locator: Number,
  number: Number,
  "number-of-pages": Number,
  "number-of-volumes": Number,
  page: Number,
  "page-first": Number,
  "part-number": Number,
  "printing-number": Number,
  section: Number,
  "supplement-number": Number,
  version: Number,
  volume: Number,
  datePublished: Date,
  dateAccessed: Date,
  dateEvent: Date,
  dateAvailable: Date,
  dateOriginal: Date,
  dateSubmitted: Date,
  contributors: [ContributorSchema],
  organization: String,
  series: String,
  type: String,
  runningTime: String,
  format: String,
  cslJson: Object,
  image_url: String,
  apiSource: String,
  subject: [String],
  referencesUsed: [referencesUsedSchema],
  citationIdList: [String],
  isOwnedBy: [String],
  tags: [TagSchema],

}, {timestamps: true});

CSLBibSchema.pre('save', async function (next) {
  const reference = this as unknown as CSLBibInterface;
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