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
    given: {
      type: String
    },
    family: {
      type: String
    },
    middle: {
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
  accessed: string; // Date accessed
  "available-date": string; // Date treaty was signed, or online publication date before formal publication
  "event-date": string; // Date of event
  issued: string; // Date published
  "original-date": string; // Issue date of original version
  submitted: string; // Date item was submitted for publication

  // Contributor variables *********
  author: string;
  chair: string;
  "collection-editor": string;
  compiler: string;
  composer: string;
  "container-author": string;
  contributor: string;
  curator: string;
  director: string;
  editor: string;
  "editorial-director": string;
  "editor-translator": string;
  "executive-producer": string;
  guest: string;
  host: string;
  illustrator: string;
  interviewer: string;
  narrator: string;
  organizer: string;
  "original-author": string;
  performer: string;
  producer: string;
  recipient: string;
  "reviewed-author": string;
  "script-writer": string;
  "series-creator": string;
  translator: string;
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
  "archive-place": String,
  "event-place": String,
  "original-publisher-place": String,
  "publisher-place": String,
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
  volume: String,
  yearPublished: String,
  monthPublished: String,
  dayPublished: String,
  yearAccessed: String,
  monthAccessed: String,
  dayAccessed:String ,
  yearEvent: String,
  monthEvent: String,
  dayEvent: String,
  yearAvailable: String,
  monthAvailable: String,
  dayAvailable: String,
  yearOriginal: String,
  monthOriginal: String,
  dayOriginal: String,
  yearSubmitted: String,
  monthSubmitted: String,
  daySubmitted: String,
  contributors: [ContributorSchema],
  author: [ContributorSchema],
  editor: [ContributorSchema],
  chair: [ContributorSchema],
  "collection-editor": [ContributorSchema],
  compiler: [ContributorSchema],
  composer: [ContributorSchema],
  "container-author": [ContributorSchema],
  contributor: [ContributorSchema],
  curator: [ContributorSchema],
  director: [ContributorSchema],
  "editorial-director": [ContributorSchema],
  "editor-translator": [ContributorSchema],
  "executive-producer": [ContributorSchema],
  guest: [ContributorSchema],
  host: [ContributorSchema],
  illustrator: [ContributorSchema],
  interviewer: [ContributorSchema],
  narrator: [ContributorSchema],
  organizer: [ContributorSchema],
  "original-author": [ContributorSchema],
  performer: [ContributorSchema],
  producer: [ContributorSchema],
  recipient: [ContributorSchema],
  "reviewed-author": [ContributorSchema],
  "script-writer": [ContributorSchema],
  "series-creator": [ContributorSchema],
  translator: [ContributorSchema],
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