'use client'

import { useState } from "react";
import ContributorForm from "./ContributorForm";
import { Contributor } from "@/models/Contributor";
import { HandleInitialReference } from "./citationActions";
import { useRouter, useSearchParams } from "next/navigation";
import { mutate } from "swr";
import { EditReference } from "./editReferenceActions";
import WebForm from "./form-components/WebForm";
import BookForm from "./form-components/BookForm";
import JournalForm from "./form-components/JournalForm";
import MagazineForm from "./form-components/MagazineForm";
import NewspaperForm from "./form-components/NewspaperForm";
import DatabaseForm from "./form-components/DatabaseForm";

enum EntryType {
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


interface FormData {
  entryType: {
    type: string,
    enum: EntryType
  }
  //type: string;
  title: string;
  contributors: Contributor[];
  publisher: string;
  year: number;
  month: string;
  address: string;
  edition: string;
  volume: string;
  isbn: string;
  doi: string;
  pages: string;
  journal: string;
  image_url: string;
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
  referenceForm: FormData;
  forNewReference?: boolean;
};

const Form = ({ formId, referenceForm, forNewReference = true }: Props) => {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const contentType = "application/json";

  const webData = {
    type: "website",
    citekey: "",
    image_url: "",
    contributors: new Array<Contributor>(),
    source_title: "",
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
    source_title: "",
    volume: "",
    edition: "",
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
    source_title: "",
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
    source_title: "",
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
    source_title: "",
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
    source_title: "",
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
    entryType: referenceForm.entryType,
    //type: referenceForm.type,
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

  //Handling contributor stuff
  const updateFormData = (newData: Array<any>) => {
    setForm({
      ...form,
      contributors: newData,
    });
  };



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

  const putData = async (form: FormData) => {
    const id  = searchParams.get("id");

    try {
      const res = await fetch(`/api/references/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      const { data } = await res.json();

      mutate(`/api/references/${id}`, data, true); // Update the local data without a revalidation
      router.refresh();
    } catch (error) {
      setMessage("Failed to update reference");
    }
  };


  /* Makes sure reference info is filled for reference name, type, contributors, and image url*/
  const formValidate = () => {
    let err: Error = {};
    //if (!form.type) err.type = "Type is required";
    if (!form.title) err.title = "Title is required";
    if (!form.contributors) err.contributors = "Contributor info is required";
    if (!form.publisher) err.publisher = "Publisher is required";
    if (!form.year) err.year = "Year is required";
    return err;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = formValidate();
    const id = searchParams.get('id')
    if (Object.keys(errs).length === 0) {
      forNewReference ? HandleInitialReference(form) : EditReference(form, id);
    } else {
      setErrors({ errs });
    }
  };

  // let formTitle: String;
  // if (form.type) {
  //   formTitle = "Edit Reference"
  // }
  // else {
  //   formTitle = "Add Reference"
  // }

  return (
    <>
    <div className="bg-gray-100 w-2/5 rounded-xl">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl align-middle">Add Reference</h1>
      </div>
      <br/>
      <ContributorForm updateFormData ={ updateFormData } contributors = {form.contributors}/>
        <form id={formId} onSubmit={handleSubmit}>

          {/* <label htmlFor="type">Type</label>
          <select name="type" className="bg-white border-gray-300 rounded-lg w-full h-8 border-t border-r border-l border-b" defaultValue={form.type} onChange={handleChange} required>
            <option value="" disabled hidden>Choose here</option>
            <option value="website">Website</option>
            <option value="book">Book</option>
            <option value="journal">Journal</option>
          </select> */}

          <select id="reference-select-entrytype" name="entryType" onChange={handleChange}>
            {Object.values(EntryType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </form>
        <br/>


          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="reference-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
            {form.entryType.type == "website" && (
              <WebForm formID={"add-web-reference"} webForm={webData}  />
            )}

            {form.entryType.type == "book" && (
              <BookForm formID={"add-book-reference"} bookForm={bookData} />
            )}

            {form.entryType.type == "journal" && (
              <JournalForm formID={"add-journal-reference"} journalForm={journalData} />
            )}

            {form.entryType.type == "magazine" && (
              <MagazineForm formID={"add-magazine-reference"} magazineForm={magazineData} />
            )}

            {form.entryType.type == "newspaper" && (
              <NewspaperForm formID={"add-newspaper-reference"} newspaperForm={newspaperData} />
            )}

            {form.entryType.type == "database" && (
              <DatabaseForm formID={"add-database-reference"} databaseForm={databaseData} />
            )}
        </div>
    </>
  );
};

export default Form;