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
import { CSLGeneralFields } from "@/models/CSLBibTex";


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


interface ReferenceFormData extends CSLGeneralFields {
  type: string,
  /* Geographical location of archive (Will be converted into archive-place) */
  "archive-place": string,
  archivePlaceCity: string,
  archivePlaceCountry: string,
  /* Geographical location of event (Will be converted into event-place) */
  "event-place": string,
  eventPlaceCity: string,
  eventPlaceCountry: string,
  /* Geographical location of Original publisher place (Will be converted into original-publisher-place) */
  "original-publisher-place": string,
  origPubPlaceCity: string,
  origPubPlaceCountry: string,
  /* Geographical location of the current publisher place (Will be converted into publisher-place) */
  "publisher-place": string,
  publisherPlaceCity: string,
  publisherPlaceCountry: string,
  monthPublished: string,
  yearPublished: string,
  dayPublished: string,
  monthEvent: string,
  yearEvent: string,
  dayEvent: string,
  monthAccessed: string,
  yearAccessed: string,
  dayAccessed: string,
  monthAvailable: string,
  yearAvailable: string,
  dayAvailable: string,
  monthOriginal: string,
  yearOriginal: string,
  dayOriginal: string,
  monthSubmitted: string,
  yearSubmitted: string,
  daySubmitted: string,
  contributors: Contributor[];
  running_time: string;
  format: string;
  image_url: string;
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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const contentType = "application/json";

  /*Set initial state to website so the page is not blank*/
  // These form field names must match the field names of the Mongoose schema to be saved in the DB
  const [form, setForm] = useState({
    archivePlaceCity: referenceForm.archivePlaceCity,
    archivePlaceCountry: referenceForm.archivePlaceCountry,
    "archive-place": referenceForm["archive-place"],
    eventPlaceCity: referenceForm.eventPlaceCity,
    eventPlaceCountry: referenceForm.eventPlaceCountry,
    publisherPlaceCity: referenceForm.publisherPlaceCity,
    publisherPlaceCountry: referenceForm.publisherPlaceCountry,
    "container-title": referenceForm["container-title"],
    "collection-title": referenceForm["collection-title"], // Series
    page: referenceForm.page, // Range of pages
    "number-of-pages": referenceForm["number-of-pages"], // Total # of pages
    volume: referenceForm.volume, // Associated volume
    "number-of-volumes": referenceForm["number-of-volumes"], // Total # of volumes
    edition: referenceForm.edition,
    /* Date Fields */
    monthPublished: referenceForm.monthPublished, // Date published
    yearPublished: referenceForm.yearPublished, // Date published
    dayPublished: referenceForm.dayPublished, // Date published
    monthAccessed: referenceForm.monthAccessed, // Date accessed
    yearAccessed: referenceForm.yearAccessed, // Date accessed
    dayAccessed: referenceForm.dayAccessed, // Date accessed
    monthEvent: referenceForm.monthEvent, // Date of event
    yearEvent: referenceForm.yearEvent, // Date of event
    dayEvent: referenceForm.dayEvent, // Date of event
    monthAvailable: referenceForm.monthAvailable, // Date available
    yearAvailable: referenceForm.yearAvailable, // Date available
    dayAvailable: referenceForm.dayAvailable, // Date available
    monthOriginal: referenceForm.monthOriginal, // Date of original
    yearOriginal: referenceForm.yearOriginal, // Date of original
    dayOriginal: referenceForm.dayOriginal, // Date of original
    monthSubmitted: referenceForm.monthSubmitted, // Date submitted
    yearSubmitted: referenceForm.yearSubmitted, // Date submitted
    daySubmitted: referenceForm.daySubmitted, // Date submitted
    /* End Date Fields */
    annote: referenceForm.annote,
    abstract: referenceForm.abstract,
    archive: referenceForm.archive,
    archive_collection: referenceForm.archive_collection,
    archive_location: referenceForm.archive_location,
    authority: referenceForm.authority,
    "call-number": referenceForm["call-number"],
    "citation-key": referenceForm["citation-key"],
    "citation-label": referenceForm["citation-label"],
    dimensions: referenceForm.dimensions,
    division: referenceForm.division,
    genre: referenceForm.genre,
    jurisdiction: referenceForm.jurisdiction,
    keyword: referenceForm.keyword,
    language: referenceForm.language,
    license: referenceForm.license,
    medium: referenceForm.medium,
    "original-publisher": referenceForm["original-publisher"],
    "original-title": referenceForm["original-title"],
    "part-title": referenceForm["part-title"],
    PMCID: referenceForm.PMCID,
    PMID: referenceForm.PMID,
    references: referenceForm.references,
    "reviewed-genre": referenceForm["reviewed-genre"],
    "reviewed-title": referenceForm["reviewed-title"],
    scale: referenceForm.scale,
    source: referenceForm.source,
    status: referenceForm.status,
    "volume-title": referenceForm["volume-title"],
    "year-suffix": referenceForm["year-suffix"],
    "chapter-number": referenceForm["chapter-number"],
    "citation-number": referenceForm["citation-number"],
    "collection-number": referenceForm["collection-number"],
    "first-reference-note-number": referenceForm["first-reference-note-number"],
    issue: referenceForm.issue,
    locator: referenceForm.locator,
    number: referenceForm.number,
    "page-first": referenceForm["page-first"],
    "part-number": referenceForm["part-number"],
    "printing-number": referenceForm["printing-number"],
    "supplement-number": referenceForm["supplement-number"],
    version: referenceForm.version,    
    section: referenceForm.section,
    contributors: referenceForm.contributors,
    editor: referenceForm.editor,
    note: referenceForm.note,
    publisher: referenceForm.publisher,
    title: referenceForm.title,
    type: referenceForm.type,
    DOI: referenceForm.DOI,
    ISSN: referenceForm.ISSN,
    ISBN: referenceForm.ISBN,
    URL: referenceForm.URL,
    organization: referenceForm.organizer,
    running_time: referenceForm.running_time,
    format: referenceForm.format,
    image_url: referenceForm.image_url,
    api_source: referenceForm.api_source,
  });


  /*Set the type so the form is not blank*/
  if (!form.type){
    form.type = "article";
  }

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
    //if (!form.year_published) err.year = "Year is required";
    return err;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = formValidate();
    const id = searchParams.get('id')
    const userId = session?.user?.id;

    if (Object.keys(errs).length === 0) {
      if (forNewReference){
        HandleManualReference(form, userId);
        // router.push("reference-table");
        // router.refresh();
      } else {
        EditReference(form, id);
        // router.push("reference-table");
        // router.refresh();
      }
    } else {
      setErrors({ errs });
    }
  };

  return (
    <>
        <div className="center-content">
          <div className="bg-gray-100 w-2/5 rounded-xl pb-5">
            <div className="flex justify-center items-center">
              {forNewReference && (
                <h1 className="text-2xl align-middle pt-5">Add Reference</h1>
              )}
              {!forNewReference && (
                <h1 className="text-2xl align-middle pt-5">Edit Reference</h1>
              )}
            </div>
            <br/>
            <form id={formId} onSubmit={handleSubmit}>
                {forNewReference && (
                  <select id="reference-select-entrytype" 
                  name="type" 
                  defaultValue={form.type}
                  onChange={handleChange}>
                  {Object.values(EntryType).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                )}

                {/*Image URL Field for References*/}
                {form.type && (
                  <FormField labelText={"Image URL (Optional)"} fieldName={"image_url"} fieldValue={form.image_url} fieldType={"url"} fieldPlaceholder={"Image URL"} handleChange={handleChange} />
                )}

                {/*Title field*/}
                {form.type && (
                  <FormField labelText={"Title"} fieldName={"title"} fieldValue={form.title} fieldType={"text"} fieldPlaceholder={"Title"} handleChange={handleChange} />
                )}

                {/*Container Title Field*/}
                {/*Will need to make a case for book titles since container-title covers jounrals, books, and more */}
                {(form.type == "article-journal" || form.type == "article-magazine" || form.type == "article-newspaper"
                  || form.type == "webpage") && (
                  <FormField labelText={"Title From Where the Source Came From"} fieldName={"container-title"} fieldValue={form["container-title"]} fieldType={"text"} fieldPlaceholder={"Title From Where the Source Came From"} handleChange={handleChange} />
                )}

                {/*Contributors Field*/}
                {form.type && (
                  <div className="flex items-center justify-center pt-5">
                    <ContributorForm updateFormData={updateFormData} contributors={form.contributors}/>
                  </div>
                )}

                {/*CollectionTitle Field*/}
                {(form.type == "book" || form.type == "article-journal") && (
                  <FormField labelText={"Collection Title (series)"} fieldName={"collection-title"} fieldValue={form["collection-title"]} fieldType={"text"} fieldPlaceholder={"Series"} handleChange={handleChange} />
                )}

                {/*Pages Field*/}
                {(form.type == "book" || form.type == "article-journal" || form.type == "article-magazine"
                  || form.type == "article-newspaper") && (
                  <FormField labelText={"Number of Pages"} fieldName={"number-of-pages"} fieldValue={form["number-of-pages"]} fieldType={"number"} fieldPlaceholder={"Number of Pages"} handleChange={handleChange} />
                )}

                {/*Volume Field*/}
                {(form.type == "book" || form.type == "article-journal" || form.type == "article-magazine") && (
                  <FormField labelText={"Volume"} fieldName={"volume"} fieldValue={form.volume} fieldType={"number"} fieldPlaceholder={"Volume"} handleChange={handleChange} />
                )}

                {/*Number of Volumes Field*/}
                {(form.type == "book") && (
                  <FormField labelText={"Number of Volumes"} fieldName={"number-of-volumes"} fieldValue={form["number-of-volumes"]} fieldType={"text"} fieldPlaceholder={"Number of Volumes"} handleChange={handleChange} />
                )}

                {/*Publisher Location Field*/}
                {(form.type == "article-newspaper") && (
                  <div>
                    <FormField labelText={"Publisher City"} fieldName={"publisherPlaceCity"} fieldValue={form.publisherPlaceCity} fieldType={"text"} fieldPlaceholder={"Publisher City"} handleChange={handleChange} />
                    <FormField labelText={"Publisher Country"} fieldName={"publisherPlaceCountry"} fieldValue={form.publisherPlaceCountry} fieldType={"text"} fieldPlaceholder={"Publisher Country"} handleChange={handleChange} />
                  </div>
                )}

                {/*Edition Field*/}
                {(form.type == "book" || form.type == "article-newspaper") && (
                  <FormField labelText={"Edition"} fieldName={"edition"} fieldValue={form.edition} fieldType={"text"} fieldPlaceholder={"Edition"} handleChange={handleChange} />
                )}

                {/*Publisher Field*/}
                {(form.type == "book" || form.type == "webpage") && (
                  <FormField labelText={"Publisher"} fieldName={"publisher"} fieldValue={form.publisher} fieldType={"text"} fieldPlaceholder={"Publisher"} handleChange={handleChange} />
                )}

                {/*Date Published Field*/}
                {form.type && (
                  <DatePicker masterLabelText={"Date Published (Month, Day, Year)"} labelText={["Month", "Day", "Year"]} fieldName={["monthPublished", "dayPublished", "yearPublished"]} fieldValue={[form.monthPublished, form.dayPublished, form.yearPublished]} fieldType={"text"} fieldPlaceholder={"Pick a Year"} handleChange={handleChange} />
                )}

                {/*URL Accessed Field*/}
                {form.type && (
                  <FormField labelText={"Source Accessed By URL "} fieldName={"URL"} fieldValue={form.URL} fieldType={"url"} fieldPlaceholder={"Source Accessed By URL"} handleChange={handleChange} />
                )}

                {/*Date Accessed Field*/}
                {(form.type == "article-journal" || form.type == "article-magazine" || form.type == "article-newspaper"
                  || form.type == "webpage") && (
                  <DatePicker masterLabelText={"Date Accessed (Month, Day, Year)"} labelText={["Month", "Day", "Year"]} fieldName={["monthAccessed", "dayAccessed", "yearAccessed"]} fieldValue={[form.monthAccessed, form.dayAccessed, form.yearAccessed]} fieldType={"text"} fieldPlaceholder={"Pick a Year"} handleChange={handleChange} />
                )}

                {/*ISBN Field*/}
                {(form.type == "book") && (
                  <FormField labelText={"International Standard Book Number (ISBN)"} fieldName={"ISBN"} fieldValue={form.ISBN} fieldType={"text"} fieldPlaceholder={"ISBN"} handleChange={handleChange} />
                )}

                {/*Issue Field*/}
                {(form.type == "article-journal" || form.type == "article-magazine") && (
                  <FormField labelText={"Issue Number"} fieldName={"number"} fieldValue={form.number} fieldType={"number"} fieldPlaceholder={"Issue Number"} handleChange={handleChange} />
                )}
        
                {/*DOI Field*/}
                {(form.type == "article-journal") && (
                  <FormField labelText={"Digital Object Identifier (DOI)"} fieldName={"DOI"} fieldValue={form.DOI} fieldType={"text"} fieldPlaceholder={"DOI"} handleChange={handleChange} />
                )}

                {/*ISSN Field*/}
                {(form.type == "article-journal" || form.type == "article-magazine" || form.type == "article-newspaper") && (
                  <FormField labelText={"International Standard Serial Number (ISSN)"} fieldName={"ISSN"} fieldValue={form.ISSN} fieldType={"text"} fieldPlaceholder={"ISSN"} handleChange={handleChange} />
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
          </div>
    </>
  );
};

export default Form;