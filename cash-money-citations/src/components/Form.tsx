'use client'

import { useState } from "react";
import { Contributor } from "@/models/Contributor";
import { useRouter, useSearchParams } from "next/navigation";
import { HandleManualReference } from "./componentActions/citationActions";
import { EditReference } from "./componentActions/editReferenceActions";
import FormField from "./FormField";
import DatePicker from "./DatePicker";
import ContributorForm from "./ContributorForm";
import { useSession } from "next-auth/react";


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
  month_published: string;//
  day_published: string;//
  year_published: string;//
  /*The next three fields are later
  converted into a date object*/
  month_accessed: string;//
  day_accessed: string;//
  year_accessed: string;//
  /*The next three fields are later
  converted into a date object*/
  month_event: string;
  day_event: string;
  year_event: string;
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
  doi: string;//
  issn: [string];
  isbn: string;//
  url: string;
  rights: string;
  running_time: string;
  format: string;
  image_url: string;//
  issue: string;
  api_source: string;
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
  const [selectedEntryType, setSelectedEntryType] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const contentType = "application/json";

  /*Set the selectedEntryType so the form is not blank*/
  if (!selectedEntryType){
    setSelectedEntryType('article');
  }

  /*Set initial state to website so the page is not blank*/
  const [form, setForm] = useState({
    address: referenceForm.address,
    annote: referenceForm.annote,
    contributors: referenceForm.contributors,
    website_title: referenceForm.website_title,
    chapter: referenceForm.chapter,
    edition: referenceForm.edition,
    editor: referenceForm.editor,
    howpublished: referenceForm.howpublished,
    institution: referenceForm.institution,
    journal: referenceForm.journal,
    month_published: referenceForm.month_published,
    day_published: referenceForm.day_published,
    year_published: referenceForm.year_published,
    month_accessed: referenceForm.month_accessed,
    day_accessed: referenceForm.day_accessed,
    year_accessed: referenceForm.year_accessed,
    month_event: referenceForm.month_event,
    day_event: referenceForm.day_event,
    year_event: referenceForm.year_event,
    note: referenceForm.note,
    number: referenceForm.number,
    organization: referenceForm.organization,
    pages: referenceForm.pages,
    publisher: referenceForm.publisher,
    school: referenceForm.school,
    series: referenceForm.series,
    volumes: referenceForm.volumes,
    short_title: referenceForm.short_title,
    title: referenceForm.title,
    type: referenceForm.type,
    volume: referenceForm.volume,
    doi: referenceForm.doi,
    issn: referenceForm.issn,
    isbn: referenceForm.isbn,
    url: referenceForm.url,
    rights: referenceForm.rights,
    running_time: referenceForm.running_time,
    format: referenceForm.format,
    image_url: referenceForm.image_url,
    issue: referenceForm.issue,
    api_source: referenceForm.api_source,
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

  const formValidate = () => {
    let err: Error = {};
    //if (!form.type) err.type = "Type is required";
    if (!form.title) err.title = "Title is required";
    if (!form.contributors) err.contributors = "Contributor info is required";
    if (!form.publisher) err.publisher = "Publisher is required";
    if (!form.year_published) err.year = "Year is required";
    return err;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = formValidate();
    const id = searchParams.get('id')
    const userId = session?.user?.id;

    if (Object.keys(errs).length === 0) {
      forNewReference ? HandleManualReference(form, userId) : EditReference(form, id);
    } else {
      setErrors({ errs });
    }
  };

  return (
    <>
    <div className="bg-gray-100 w-2/5 rounded-xl">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl align-middle">Add Reference</h1>
      </div>
      <br/>
      <form id={formId} onSubmit={handleSubmit}>
          <select id="reference-select-entrytype" 
            name="entryType" 
            defaultValue={selectedEntryType}
            onChange={(e) => setSelectedEntryType(e.target.value)}>
            {Object.values(EntryType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          {/*Image URL Field for References*/}
          {selectedEntryType && (
            <FormField labelText={"Image URL (Optional)"} fieldName={"image_url"} fieldValue={form.image_url} fieldType={"url"} fieldPlaceholder={"Image URL"} handleChange={handleChange} />
          )}

          {/*Title field*/}
          {selectedEntryType && (
            <FormField labelText={"Title"} fieldName={"title"} fieldValue={form.title} fieldType={"text"} fieldPlaceholder={"Title"} handleChange={handleChange} />
          )}

          {/*Contributors Field*/}
          {selectedEntryType && (
            <div className="flex items-center justify-center pt-10">
              <ContributorForm updateFormData={updateFormData} contributors={form.contributors}/>
            </div>
          )}

          {/*Series Field*/}
          {(selectedEntryType == "book") && (
            <FormField labelText={"Series"} fieldName={"series"} fieldValue={form.series} fieldType={"text"} fieldPlaceholder={"Series"} handleChange={handleChange} />
          )}

          {/*Pages Field*/}
          {(selectedEntryType == "book" || selectedEntryType == "article-journal") && (
            <FormField labelText={"Number of Pages"} fieldName={"pages"} fieldValue={form.pages} fieldType={"text"} fieldPlaceholder={"Number of Pages"} handleChange={handleChange} />
          )}

          {/*Volume Field*/}
          {(selectedEntryType == "book") && (
            <FormField labelText={"Volume"} fieldName={"volume"} fieldValue={form.volume} fieldType={"text"} fieldPlaceholder={"Volume"} handleChange={handleChange} />
          )}

          {/*Number of Volumes Field*/}
          {(selectedEntryType == "book") && (
            <FormField labelText={"Number of Volumes"} fieldName={"volumes"} fieldValue={form.volumes} fieldType={"text"} fieldPlaceholder={"Number of Volumes"} handleChange={handleChange} />
          )}

          {/*Edition Field*/}
          {(selectedEntryType == "book") && (
            <FormField labelText={"Edition"} fieldName={"edition"} fieldValue={form.edition} fieldType={"text"} fieldPlaceholder={"Edition"} handleChange={handleChange} />
          )}

          {/*Publisher Field*/}
          {(selectedEntryType == "book") && (
            <FormField labelText={"Publisher"} fieldName={"publisher"} fieldValue={form.publisher} fieldType={"text"} fieldPlaceholder={"Publisher"} handleChange={handleChange} />
          )}

          {/*Date Field*/}
          {(selectedEntryType == "book") && (
            <DatePicker masterLabelText={"Date Published (Month, Day, Year)"} labelText={["Month", "Day", "Year"]} fieldName={["month", "day", "year"]} fieldValue={[form.month_published, form.day_published, form.year_published]} fieldType={"text"} fieldPlaceholder={"Pick a Year"} handleChange={handleChange} />
          )}

          {/*ISBN Field*/}
          {(selectedEntryType == "book") && (
            <FormField labelText={"International Standard Book Number (ISBN)"} fieldName={"isbn"} fieldValue={form.isbn} fieldType={"text"} fieldPlaceholder={"ISBN"} handleChange={handleChange} />
          )}
  

           
          <DatePicker masterLabelText={"Date Accessed (Month, Day, Year)"} labelText={["Month", "Day", "Year"]} fieldName={["month", "day", "year"]} fieldValue={[form.month_accessed, form.day_accessed, form.year_accessed]} fieldType={"text"} fieldPlaceholder={"Pick a Year"} handleChange={handleChange} />
          <FormField labelText={"Address"} fieldName={"address"} fieldValue={form.address} fieldType={"text"} fieldPlaceholder={"Address"} handleChange={handleChange} />
          <FormField labelText={"Digital Object Identifier (DOI)"} fieldName={"doi"} fieldValue={form.doi} fieldType={"text"} fieldPlaceholder={"DOI"} handleChange={handleChange} />
          <FormField labelText={"Journal"} fieldName={"journal"} fieldValue={form.journal} fieldType={"text"} fieldPlaceholder={"Journal"} handleChange={handleChange} />
          <FormField labelText={"Annotation"} fieldName={"annote"} fieldValue={form.annote} fieldType={"text"} fieldPlaceholder={"Annotation"} handleChange={handleChange} />
          <FormField labelText={"Website Title"} fieldName={"website_title"} fieldValue={form.website_title} fieldType={"text"} fieldPlaceholder={"Website Title"} handleChange={handleChange} />
          <FormField labelText={"Chapter"} fieldName={"chapter"} fieldValue={form.chapter} fieldType={"text"} fieldPlaceholder={"Chapter"} handleChange={handleChange} />
          <FormField labelText={"Editor"} fieldName={"editor"} fieldValue={form.editor} fieldType={"text"} fieldPlaceholder={"Editor"} handleChange={handleChange} />
          <FormField labelText={"Publisher Type"} fieldName={"howpublished"} fieldValue={form.howpublished} fieldType={"text"} fieldPlaceholder={"Publisher Type"} handleChange={handleChange} />
          <FormField labelText={"Institution"} fieldName={"institution"} fieldValue={form.institution} fieldType={"text"} fieldPlaceholder={"Institution"} handleChange={handleChange} />
          <DatePicker masterLabelText={"Date Event Occurred (Month, Day, Year)"} labelText={["Month", "Day", "Year"]} fieldName={["month", "day", "year"]} fieldValue={[form.month_event, form.day_event, form.year_event]} fieldType={"text"} fieldPlaceholder={"Pick a Year"} handleChange={handleChange} />
          <FormField labelText={"Note"} fieldName={"note"} fieldValue={form.note} fieldType={"text"} fieldPlaceholder={"Note"} handleChange={handleChange} />
          <FormField labelText={"Issue Number"} fieldName={"number"} fieldValue={form.number} fieldType={"text"} fieldPlaceholder={"Issue Number"} handleChange={handleChange} />
          <FormField labelText={"Organization"} fieldName={"organization"} fieldValue={form.organization} fieldType={"text"} fieldPlaceholder={"Organization"} handleChange={handleChange} />
          <FormField labelText={"School"} fieldName={"school"} fieldValue={form.school} fieldType={"text"} fieldPlaceholder={"School"} handleChange={handleChange} />
          <FormField labelText={"Type"} fieldName={"type"} fieldValue={form.type} fieldType={"text"} fieldPlaceholder={"Type"} handleChange={handleChange} />
          <FormField labelText={"International Standard Serial Number (ISSN)"} fieldName={"issn"} fieldValue={form.issn} fieldType={"text"} fieldPlaceholder={"ISSN"} handleChange={handleChange} />
          <FormField labelText={"URL"} fieldName={"url"} fieldValue={form.url} fieldType={"url"} fieldPlaceholder={"URL"} handleChange={handleChange} />
          <FormField labelText={"Running Time"} fieldName={"running_time"} fieldValue={form.running_time} fieldType={"text"} fieldPlaceholder={"Running Time"} handleChange={handleChange} />
          <FormField labelText={"Format"} fieldName={"format"} fieldValue={form.format} fieldType={"text"} fieldPlaceholder={"Format"} handleChange={handleChange} />




          <button
            type="submit" 
            className="btn bg-green-500 hover:bg-green-900 text-white">
            Submit
          </button> 
        </form>
        </div>
    </>
  );
};

export default Form;