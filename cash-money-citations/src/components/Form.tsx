'use client'

import { useState } from "react";
import { Contributor } from "@/models/Contributor";
import WebForm from "./form-components/WebForm";
import BookForm from "./form-components/BookForm";
import JournalForm from "./form-components/JournalForm";
import MagazineForm from "./form-components/MagazineForm";
import NewspaperForm from "./form-components/NewspaperForm";
import DatabaseForm from "./form-components/DatabaseForm";

interface FormData {
  type: string;
}

interface Error {
  type?: string;
  citekey?: string;
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
    type: "website",
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
    <div className="pt-5 pb-5 w-full flex items-center justify-center">
      <div className="bg-gray-100 w-2/5 rounded-xl">
        <div className="flex justify-center items-center">
          <h1 className="text-2xl align-middle pt-5">Add Reference</h1>
        </div>
        <div className="pl-14">
          <label className="font-bold" htmlFor="type">
            Type
          </label>
          <select 
            name="type" 
            className="bg-white border-gray-300 rounded-lg w-52 h-8 border-t border-r border-l border-b" 
            defaultValue={form.type} 
            onChange={handleChange} 
            required>
            <option value="" disabled hidden>Choose here</option>
            <option value="website">Website</option>
            <option value="book">Book</option>
            <option value="journal">Journal</option>
            <option value="magazine">Magazine</option>
            <option value="newspaper">Newspaper</option>
            <option value="database">Database</option>
          </select>
        </div>
        <br/>

            {form.type == "website" && (
              <WebForm formID={"add-web-reference"} webForm={webData}  />
            )}

            {form.type == "book" && (
              <BookForm formID={"add-book-reference"} bookForm={bookData} />
            )}

            {form.type == "journal" && (
              <JournalForm formID={"add-journal-reference"} journalForm={journalData} />
            )}

            {form.type == "magazine" && (
              <MagazineForm formID={"add-magazine-reference"} magazineForm={magazineData} />
            )}

            {form.type == "newspaper" && (
              <NewspaperForm formID={"add-newspaper-reference"} newspaperForm={newspaperData} />
            )}

            {form.type == "database" && (
              <DatabaseForm formID={"add-database-reference"} databaseForm={databaseData} />
            )}
        </div>
      </div>
    </>
  );
};

export default Form;