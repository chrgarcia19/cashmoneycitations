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
  location: string;
  annote: string;
  contributors: Contributor[];
  indextitle: string;
  chapter: string;
  edition: string;
  editor: string;
  howpublished: string;
  institution: string;
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
    location: referenceForm.location,
    annote: referenceForm.annote,
    contributors: referenceForm.contributors,
    indextitle: referenceForm.indextitle,
    chapter: referenceForm.chapter,
    edition: referenceForm.edition,
    editor: referenceForm.editor,
    howpublished: referenceForm.howpublished,
    institution: referenceForm.institution,
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
    if (!form.title) err.title = "Title is required";
    if (!form.contributors) err.contributors = "Contributor info is required";
    //if (!form.publisher) err.publisher = "Publisher is required";
    if (!form.year_published) err.year = "Year is required";
    return err;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = formValidate();
    const id = searchParams.get('id')
    const userId = session?.user?.id;

    form.type = selectedEntryType;
    if (Object.keys(errs).length === 0) {
      if (forNewReference){
        HandleManualReference(form, userId);
        router.push("reference-table");
        router.refresh();
      } else {
        EditReference(form, id);
        router.push("reference-table");
        router.refresh();
      }
    } else {
      setErrors({ errs });
    }
  };

  return (
    <>
    <div className="bg-gray-100 w-2/5 rounded-xl pb-5">
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

          {/*Index Title Field*/}
          {(selectedEntryType == "article-journal" || selectedEntryType == "article-magazine" || selectedEntryType == "article-newspaper"
            || selectedEntryType == "webpage") && (
            <FormField labelText={"Title From Where the Source Came From"} fieldName={"indextitle"} fieldValue={form.indextitle} fieldType={"text"} fieldPlaceholder={"Title From Where the Source Came From"} handleChange={handleChange} />
          )}

          {/*Contributors Field*/}
          {selectedEntryType && (
            <div className="flex items-center justify-center pt-5">
              <ContributorForm updateFormData={updateFormData} contributors={form.contributors}/>
            </div>
          )}

          {/*Series Field*/}
          {(selectedEntryType == "book" || selectedEntryType == "article-journal") && (
            <FormField labelText={"Series"} fieldName={"series"} fieldValue={form.series} fieldType={"text"} fieldPlaceholder={"Series"} handleChange={handleChange} />
          )}

          {/*Pages Field*/}
          {(selectedEntryType == "book" || selectedEntryType == "article-journal" || selectedEntryType == "article-magazine"
            || selectedEntryType == "article-newspaper") && (
            <FormField labelText={"Number of Pages"} fieldName={"pages"} fieldValue={form.pages} fieldType={"number"} fieldPlaceholder={"Number of Pages"} handleChange={handleChange} />
          )}

          {/*Volume Field*/}
          {(selectedEntryType == "book" || selectedEntryType == "article-journal" || selectedEntryType == "article-magazine") && (
            <FormField labelText={"Volume"} fieldName={"volume"} fieldValue={form.volume} fieldType={"number"} fieldPlaceholder={"Volume"} handleChange={handleChange} />
          )}

          {/*Number of Volumes Field*/}
          {(selectedEntryType == "book") && (
            <FormField labelText={"Number of Volumes"} fieldName={"volumes"} fieldValue={form.volumes} fieldType={"text"} fieldPlaceholder={"Number of Volumes"} handleChange={handleChange} />
          )}

          {/*Location Field*/}
          {(selectedEntryType == "article-newspaper") && (
            <FormField labelText={"Location"} fieldName={"location"} fieldValue={form.location} fieldType={"text"} fieldPlaceholder={"Location"} handleChange={handleChange} />
          )}

          {/*Edition Field*/}
          {(selectedEntryType == "book" || selectedEntryType == "article-newspaper") && (
            <FormField labelText={"Edition"} fieldName={"edition"} fieldValue={form.edition} fieldType={"number"} fieldPlaceholder={"Edition"} handleChange={handleChange} />
          )}

          {/*Publisher Field*/}
          {(selectedEntryType == "book" || selectedEntryType == "webpage") && (
            <FormField labelText={"Publisher"} fieldName={"publisher"} fieldValue={form.publisher} fieldType={"text"} fieldPlaceholder={"Publisher"} handleChange={handleChange} />
          )}

          {/*Date Published Field*/}
          {selectedEntryType && (
            <DatePicker masterLabelText={"Date Published (Month, Day, Year)"} labelText={["Month", "Day", "Year"]} fieldName={["month_published", "day_published", "year_published"]} fieldValue={[form.month_published, form.day_published, form.year_published]} fieldType={"text"} fieldPlaceholder={"Pick a Year"} handleChange={handleChange} />
          )}

          {/*URL Accessed Field*/}
          {selectedEntryType && (
            <FormField labelText={"Source Accessed By URL "} fieldName={"url"} fieldValue={form.url} fieldType={"url"} fieldPlaceholder={"Source Accessed By URL"} handleChange={handleChange} />
          )}

          {/*Date Accessed Field*/}
          {(selectedEntryType == "article-journal" || selectedEntryType == "article-magazine" || selectedEntryType == "article-newspaper"
            || selectedEntryType == "webpage") && (
            <DatePicker masterLabelText={"Date Accessed (Month, Day, Year)"} labelText={["Month", "Day", "Year"]} fieldName={["month_accessed", "day_accessed", "year_accessed"]} fieldValue={[form.month_accessed, form.day_accessed, form.year_accessed]} fieldType={"text"} fieldPlaceholder={"Pick a Year"} handleChange={handleChange} />
          )}

          {/*ISBN Field*/}
          {(selectedEntryType == "book") && (
            <FormField labelText={"International Standard Book Number (ISBN)"} fieldName={"isbn"} fieldValue={form.isbn} fieldType={"text"} fieldPlaceholder={"ISBN"} handleChange={handleChange} />
          )}

          {/*Issue Field*/}
          {(selectedEntryType == "article-journal" || selectedEntryType == "article-magazine") && (
            <FormField labelText={"Issue Number"} fieldName={"number"} fieldValue={form.number} fieldType={"number"} fieldPlaceholder={"Issue Number"} handleChange={handleChange} />
          )}
  
          {/*DOI Field*/}
          {(selectedEntryType == "article-journal") && (
            <FormField labelText={"Digital Object Identifier (DOI)"} fieldName={"doi"} fieldValue={form.doi} fieldType={"text"} fieldPlaceholder={"DOI"} handleChange={handleChange} />
          )}

          {/*ISSN Field*/}
          {(selectedEntryType == "article-journal" || selectedEntryType == "article-magazine" || selectedEntryType == "article-newspaper") && (
            <FormField labelText={"International Standard Serial Number (ISSN)"} fieldName={"issn"} fieldValue={form.issn} fieldType={"text"} fieldPlaceholder={"ISSN"} handleChange={handleChange} />
          )}

          {/*Fields that may need added in the future     
          <FormField labelText={"Annotation"} fieldName={"annote"} fieldValue={form.annote} fieldType={"text"} fieldPlaceholder={"Annotation"} handleChange={handleChange} />
          <FormField labelText={"Chapter"} fieldName={"chapter"} fieldValue={form.chapter} fieldType={"text"} fieldPlaceholder={"Chapter"} handleChange={handleChange} />
          <FormField labelText={"Editor"} fieldName={"editor"} fieldValue={form.editor} fieldType={"text"} fieldPlaceholder={"Editor"} handleChange={handleChange} />
          <FormField labelText={"Publisher Type"} fieldName={"howpublished"} fieldValue={form.howpublished} fieldType={"text"} fieldPlaceholder={"Publisher Type"} handleChange={handleChange} />
          <FormField labelText={"Institution"} fieldName={"institution"} fieldValue={form.institution} fieldType={"text"} fieldPlaceholder={"Institution"} handleChange={handleChange} />
          <DatePicker masterLabelText={"Date Event Occurred (Month, Day, Year)"} labelText={["Month", "Day", "Year"]} fieldName={["month_event", "day_event", "year_event"]} fieldValue={[form.month_event, form.day_event, form.year_event]} fieldType={"text"} fieldPlaceholder={"Pick a Year"} handleChange={handleChange} />
          <FormField labelText={"Note"} fieldName={"note"} fieldValue={form.note} fieldType={"text"} fieldPlaceholder={"Note"} handleChange={handleChange} />
          <FormField labelText={"Organization"} fieldName={"organization"} fieldValue={form.organization} fieldType={"text"} fieldPlaceholder={"Organization"} handleChange={handleChange} />
          <FormField labelText={"School"} fieldName={"school"} fieldValue={form.school} fieldType={"text"} fieldPlaceholder={"School"} handleChange={handleChange} />
          <FormField labelText={"Type"} fieldName={"type"} fieldValue={form.type} fieldType={"text"} fieldPlaceholder={"Type"} handleChange={handleChange} />
          <FormField labelText={"Running Time"} fieldName={"running_time"} fieldValue={form.running_time} fieldType={"text"} fieldPlaceholder={"Running Time"} handleChange={handleChange} />
          <FormField labelText={"Format"} fieldName={"format"} fieldValue={form.format} fieldType={"text"} fieldPlaceholder={"Format"} handleChange={handleChange} />
          */}




          <button
            type="submit" 
            className="btn bg-green-500 hover:bg-green-900 text-white">
            Submit
          </button> 
        </form>
        <p>{message}</p>
        <div>
        {Object.keys(errors).map((err, index) => (
            <li key={index}>{err}</li>
        ))}
        </div>
      </div>
    </>
  );
};

export default Form;