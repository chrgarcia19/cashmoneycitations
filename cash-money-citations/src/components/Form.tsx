'use client'

import { useState } from "react";
import { Contributor } from "@/models/Contributor";
import { HandleManualReference } from "./componentActions/citationActions";
import { useSearchParams } from "next/navigation";
import { EditReference } from "./componentActions/editReferenceActions";
import WebForm from "./form-components/WebForm";
import BookForm from "./form-components/BookForm";
import JournalForm from "./form-components/JournalForm";
import MagazineForm from "./form-components/MagazineForm";
import NewspaperForm from "./form-components/NewspaperForm";
import DatabaseForm from "./form-components/DatabaseForm";

export enum EntryType {
  Article = 'article',
  Book = 'book',
  Chapter = 'chapter',
  ArticleJournal = 'article-journal',
  ArticleMagazine = 'article-magazine',
  ArticleNewspaper = 'article-newspaper',
  Bill = 'bill',
  Broadcast = 'broadcast',
  Classic = 'classic',
  Collection = 'collection',
  Dataset = 'dataset',
  Document = 'document',
  Entry = 'entry',
  EntryDictionary = 'entry-dictionary',
  EntryEncyclopedia = 'entry-encyclopedia',
  Event = 'event',
  Figure = 'figure',
  Graphic = 'graphic',
  Hearing = 'hearing',
  Interview = 'interview',
  LegalCase = 'legal_case',
  Legislation = 'legislation',
  Manuscript = 'manuscript',
  Map = 'map',
  MotionPicture = 'motion_picture',
  MusicalScore = 'musical_score',
  Pamphlet = 'pamphlet',
  PaperConference = 'paper-conference',
  Patent = 'patent',
  Performance = 'performance',
  Periodical = 'periodical',
  PersonalCommunication = 'personal_communication',
  Post = 'post',
  PostWeblog = 'post-weblog',
  Regulation = 'regulation',
  Report = 'report',
  Review = 'review',
  ReviewBook = 'review-book',
  Software = 'software',
  Song = 'song',
  Speech = 'speech',
  Standard = 'standard',
  Thesis = 'thesis',
  Treaty = 'treaty',
  Webpage = 'webpage'
}


interface ReferenceFormData {
  address: string;
  annote: string;
  contributors: Contributor[];
  website_title: string;
  chapter: string;
  edition: string;
  editor: string;
  howpublished: string;
  institution: string;
  journal: string;
  /*The next three fields are later
  converted into a date object*/
  month_published: string;
  day_published: string;
  year_published: string;
  /*The next three fields are later
  converted into a date object*/
  month_accessed: string;
  day_accessed: string;
  year_accessed: string;
  /*The next three fields are later
  converted into a date object*/
  month_event: string;
  day_event: string;
  year_event: string;
  /*The next three fields are later
  converted into a date object*/
  month_orig: string;
  day_orig: string;
  year_orig: string;
  month: string;
  year: string;
  note: string;
  number: number;
  organization: string;
  pages: string;
  publisher: string;
  school: string;
  series: string;
  volumes: string;
  short_title: string;
  title: [string];
  type: string;
  volume: number;
  doi: string;
  issn: [string];
  isbn: string;
  url: string;
  rights: string;
  runningTime: string;
  format: string;
  image_url: string;
  issue: string;
  apiSource: string;
}

interface Error {
  type?: string;
  title?: string;
  contributors?: string;
  publisher?: string;
  year?: string;
  image_url?: string;
}

type Props = {
  formId: string;
  referenceForm: ReferenceFormData;
  forNewReference?: boolean;
};

const Form = ({ formId, referenceForm, forNewReference = true }: Props) => {
  const [errors, setErrors] = useState({});
  const searchParams = useSearchParams();

  const webData = {
    type: "website",
    citekey: "",
    image_url: "",
    contributors: new Array<Contributor>(),
    title: "",
    website_title: "",
    website_url: "",
    month_accessed: "",
    day_accessed: "",
    year_accessed: "",
    month_published: "",
    day_published: "",
    year_published: "",
    publisher: "",
  };

  const bookData = {
    type: "book",
    citekey: "",
    image_url: "",
    contributors: new Array<Contributor>(),
    title: "",
    volume: "",
    edition: "",
    date: "",
    month_published: "",
    day_published: "",
    year_published: "",
    publisher: "",
    city: "",
    state: "",
    isbn: "",
  };

  const journalData = {
    type: "journal",
    citekey: "",
    image_url: "",
    contributors: new Array<Contributor>(),
    title: "",
    journal_title: "",
    volume: "",
    issue: "",
    month_published: "",
    day_published: "",
    year_published: "",
    start_page: "",
    end_page: "",
    doi: "",
    issn: "",
  };

  const magazineData = {
    type: "magazine",
    citekey: "",
    image_url: "",
    contributors: new Array<Contributor>(),
    title: "",
    magazine_title: "",
    volume: "",
    issue: "",
    month_published: "",
    day_published: "",
    year_published: "",
    start_page: "",
    end_page: "",
    doi: "",
    issn: "",
  };

  const newspaperData = {
    type: "newspaper",
    citekey: "",
    image_url: "",
    contributors: new Array<Contributor>(),
    title: "",
    newspaper_title: "",
    edition: "",
    section: "",
    city: "",
    month_published: "",
    day_published: "",
    year_published: "",
    start_page: "",
    end_page: "",
    issn: "",
  }

  const databaseData = {
    type: "database",
    citekey: "",
    image_url: "",
    contributors: new Array<Contributor>(),
    title: "",
    library: "",
    database: "",
    database_url: "",
    city: "",
    month_accessed: "",
    day_accessed: "",
    year_accessed: "",
    month_published: "",
    day_published: "",
    year_published: "",
    service: "",
    issn: "",
  }

  /*Set initial state to website so the page is not blank*/
  const [form, setForm] = useState({
    title: referenceForm.title,
    contributors: referenceForm.contributors,
    publisher: referenceForm.publisher,
    year: referenceForm.year,
    month: referenceForm.month,
    address: referenceForm.address,
    edition: referenceForm.edition,
    volume: referenceForm.volume,
    isbn: referenceForm.isbn,
    doi: referenceForm.doi,
    pages: referenceForm.pages,
    journal: referenceForm.journal,
    image_url: referenceForm.image_url,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <>
    <div className="bg-gray-100 w-2/5 rounded-xl">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl align-middle">Add Reference</h1>
      </div>
      <br/>
          <select id="reference-select-entrytype" name="entryType" onChange={handleChange}>
            {Object.values(EntryType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          
        <br/>



            {form.entryType == "webpage" && (
              <WebForm formID={"add-web-reference"} webForm={webData}  />
            )}

            {form.entryType == "book" && (
              <BookForm formID={"add-book-reference"} bookForm={bookData} />
            )}

            {form.entryType == "article-journal" && (
              <JournalForm formID={"add-journal-reference"} journalForm={journalData} />
            )}

            {form.entryType == "article-magazine" && (
              <MagazineForm formID={"add-magazine-reference"} magazineForm={magazineData} />
            )}

            {form.entryType == "article-newspaper" && (
              <NewspaperForm formID={"add-newspaper-reference"} newspaperForm={newspaperData} />
            )}

            {form.entryType == "dataset" && (
              <DatabaseForm formID={"add-database-reference"} databaseForm={databaseData} />
            )}
        </div>
    </>
  );
};

export default Form;