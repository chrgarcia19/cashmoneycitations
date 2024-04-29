"use client";

import { useState } from "react";
import { Contributor } from "@/models/Contributor";
import { useRouter, useSearchParams } from "next/navigation";
import { HandleManualReference } from "./componentActions/citationActions";
import { EditReference } from "./componentActions/editReferenceActions";
import FormField from "./FormField";
import DatePicker from "./DatePicker";
import ContributorForm from "./ContributorForm";
import { useSession } from "next-auth/react";
import { UploadBibModal } from "@/app/input-bibtex/components/Modal";
import { CSLGeneralFields } from "@/models/CSLBibTex";
import { UploadJSONModal } from "@/app/input-json/components/Modal";
import React from "react";

export enum EntryType {
  Article = "article",
  Book = "book",
  Chapter = "chapter",
  ArticleJournal = "article-journal",
  ArticleMagazine = "article-magazine",
  ArticleNewspaper = "article-newspaper",
  Bill = "bill",
  Broadcast = "broadcast",
  Classic = "classic",
  Collection = "collection",
  Dataset = "dataset",
  Document = "document",
  Entry = "entry",
  EntryDictionary = "entry-dictionary",
  EntryEncyclopedia = "entry-encyclopedia",
  Event = "event",
  Figure = "figure",
  Graphic = "graphic",
  Hearing = "hearing",
  Interview = "interview",
  LegalCase = "legal_case",
  Legislation = "legislation",
  Manuscript = "manuscript",
  Map = "map",
  MotionPicture = "motion_picture",
  MusicalScore = "musical_score",
  Pamphlet = "pamphlet",
  PaperConference = "paper-conference",
  Patent = "patent",
  Performance = "performance",
  Periodical = "periodical",
  PersonalCommunication = "personal_communication",
  Post = "post",
  PostWeblog = "post-weblog",
  Regulation = "regulation",
  Report = "report",
  Review = "review",
  ReviewBook = "review-book",
  Software = "software",
  Song = "song",
  Speech = "speech",
  Standard = "standard",
  Thesis = "thesis",
  Treaty = "treaty",
  Webpage = "webpage",
}

export interface ReferenceFormData extends CSLGeneralFields {
  id: string | string[] | undefined;
  type: string;
  /* Geographical location of archive (Will be converted into archive-place) */
  "archive-place": string;
  archivePlaceCity: string;
  archivePlaceCountry: string;
  /* Geographical location of event (Will be converted into event-place) */
  "event-place": string;
  eventPlaceCity: string;
  eventPlaceCountry: string;
  /* Geographical location of Original publisher place (Will be converted into original-publisher-place) */
  "original-publisher-place": string;
  origPubPlaceCity: string;
  origPubPlaceCountry: string;
  /* Geographical location of the current publisher place (Will be converted into publisher-place) */
  "publisher-place": string;
  publisherPlaceCity: string;
  publisherPlaceCountry: string;
  monthPublished: string;
  yearPublished: string;
  dayPublished: string;
  monthEvent: string;
  yearEvent: string;
  dayEvent: string;
  monthAccessed: string;
  yearAccessed: string;
  dayAccessed: string;
  monthAvailable: string;
  yearAvailable: string;
  dayAvailable: string;
  monthOriginal: string;
  yearOriginal: string;
  dayOriginal: string;
  monthSubmitted: string;
  yearSubmitted: string;
  daySubmitted: string;
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
  referenceForm?: ReferenceFormData;
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
    archivePlaceCity: referenceForm?.archivePlaceCity ?? undefined,
    archivePlaceCountry: referenceForm?.archivePlaceCountry ?? undefined,
    eventPlaceCity: referenceForm?.eventPlaceCity ?? undefined,
    eventPlaceCountry: referenceForm?.eventPlaceCountry ?? undefined,
    publisherPlaceCity: referenceForm?.publisherPlaceCity ?? undefined,
    publisherPlaceCountry: referenceForm?.publisherPlaceCountry ?? undefined,
    "container-title": referenceForm?.["container-title"] ?? undefined,
    "collection-title": referenceForm?.["collection-title"] ?? undefined, // Series
    page: referenceForm?.page ?? undefined, // Range of pages
    "number-of-pages": referenceForm?.["number-of-pages"] ?? undefined, // Total # of pages
    volume: referenceForm?.volume ?? undefined, // Associated volume
    "number-of-volumes": referenceForm?.["number-of-volumes"] ?? undefined, // Total # of volumes
    edition: referenceForm?.edition ?? undefined,
    /* Date Fields */
    monthPublished: referenceForm?.monthPublished ?? "", // Date published
    yearPublished: referenceForm?.yearPublished ?? "", // Date published
    dayPublished: referenceForm?.dayPublished ?? "", // Date published
    monthAccessed: referenceForm?.monthAccessed ?? "", // Date accessed
    yearAccessed: referenceForm?.yearAccessed ?? "", // Date accessed
    dayAccessed: referenceForm?.dayAccessed ?? "", // Date accessed
    monthEvent: referenceForm?.monthEvent ?? "", // Date of event
    yearEvent: referenceForm?.yearEvent ?? undefined, // Date of event
    dayEvent: referenceForm?.dayEvent ?? undefined, // Date of event
    monthAvailable: referenceForm?.monthAvailable ?? undefined, // Date available
    yearAvailable: referenceForm?.yearAvailable ?? undefined, // Date available
    dayAvailable: referenceForm?.dayAvailable ?? undefined, // Date available
    monthOriginal: referenceForm?.monthOriginal ?? undefined, // Date of original
    yearOriginal: referenceForm?.yearOriginal ?? undefined, // Date of original
    dayOriginal: referenceForm?.dayOriginal ?? undefined, // Date of original
    monthSubmitted: referenceForm?.monthSubmitted ?? undefined, // Date submitted
    yearSubmitted: referenceForm?.yearSubmitted ?? undefined, // Date submitted
    daySubmitted: referenceForm?.daySubmitted ?? undefined, // Date submitted
    /* End Date Fields */
    annote: referenceForm?.annote ?? undefined,
    abstract: referenceForm?.abstract ?? undefined,
    archive: referenceForm?.archive ?? undefined,
    archive_collection: referenceForm?.archive_collection ?? undefined,
    archive_location: referenceForm?.archive_location ?? undefined,
    authority: referenceForm?.authority ?? undefined,
    "call-number": referenceForm?.["call-number"] ?? undefined,
    "citation-key": referenceForm?.["citation-key"] ?? undefined,
    "citation-label": referenceForm?.["citation-label"] ?? undefined,
    dimensions: referenceForm?.dimensions ?? undefined,
    division: referenceForm?.division ?? undefined,
    event: referenceForm?.event ?? undefined,
    genre: referenceForm?.genre ?? undefined,
    jurisdiction: referenceForm?.jurisdiction ?? undefined,
    keyword: referenceForm?.keyword ?? undefined,
    language: referenceForm?.language ?? undefined,
    license: referenceForm?.license ?? undefined,
    medium: referenceForm?.medium ?? undefined,
    "original-publisher": referenceForm?.["original-publisher"] ?? undefined,
    "original-title": referenceForm?.["original-title"] ?? undefined,
    "part-title": referenceForm?.["part-title"] ?? undefined,
    PMCID: referenceForm?.PMCID ?? undefined,
    PMID: referenceForm?.PMID ?? undefined,
    references: referenceForm?.references ?? undefined,
    "reviewed-genre": referenceForm?.["reviewed-genre"] ?? undefined,
    "reviewed-title": referenceForm?.["reviewed-title"] ?? undefined,
    scale: referenceForm?.scale ?? undefined,
    source: referenceForm?.source ?? undefined,
    status: referenceForm?.status ?? undefined,
    "volume-title": referenceForm?.["volume-title"] ?? undefined,
    "year-suffix": referenceForm?.["year-suffix"] ?? undefined,
    "chapter-number": referenceForm?.["chapter-number"] ?? undefined,
    "citation-number": referenceForm?.["citation-number"] ?? undefined,
    "collection-number": referenceForm?.["collection-number"] ?? undefined,
    "first-reference-note-number":
      referenceForm?.["first-reference-note-number"] ?? undefined,
    issue: referenceForm?.issue ?? undefined,
    locator: referenceForm?.locator ?? undefined,
    number: referenceForm?.number ?? undefined,
    "page-first": referenceForm?.["page-first"] ?? undefined,
    "part-number": referenceForm?.["part-number"] ?? undefined,
    "printing-number": referenceForm?.["printing-number"] ?? undefined,
    "supplement-number": referenceForm?.["supplement-number"] ?? undefined,
    version: referenceForm?.version ?? undefined,
    section: referenceForm?.section ?? undefined,
    contributors: referenceForm?.contributors ?? new Array<Contributor>(),
    editor: referenceForm?.editor ?? undefined,
    note: referenceForm?.note ?? undefined,
    publisher: referenceForm?.publisher ?? undefined,
    title: referenceForm?.title ?? undefined,
    type: referenceForm?.type ?? undefined,
    DOI: referenceForm?.DOI ?? undefined,
    ISSN: referenceForm?.ISSN ?? undefined,
    ISBN: referenceForm?.ISBN ?? undefined,
    URL: referenceForm?.URL ?? undefined,
    organization: referenceForm?.organizer ?? undefined,
    running_time: referenceForm?.running_time ?? undefined,
    format: referenceForm?.format ?? undefined,
    image_url: referenceForm?.image_url ?? undefined,
    api_source: referenceForm?.api_source ?? undefined,
  });

  /*Set the type so the form is not blank*/
  if (!form.type) {
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    const id = searchParams.get("id");
    const userId = session?.user?.id;

    if (form.type === "review-book") {
      form["reviewed-genre"] = "Book";
    }

    if (Object.keys(errs).length === 0) {
      if (forNewReference) {
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
      <div className="flex mt-10 justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white">
        <div className="w-3/5 bg-white dark:bg-gray-600 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="text-center">
              {forNewReference ? (
                <div>
                  <h1 className="text-2xl mb-5 font-bold text-gray-800 dark:text-white">
                    Add Reference
                  </h1>
                  <div className="flex flex-row justify-center">
                  <div className="mx-5">
                  <UploadBibModal />
                  </div>
                  <div className="mx-5">
                  <UploadJSONModal />
                  </div>
                  </div>
                </div>
              ) : (
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Edit Reference
                </h1>
              )}
            </div>

            <form
              id={formId}
              onSubmit={handleSubmit}
              className="space-y-6 mt-6"
            >
              {forNewReference && (
                <select
                  id="reference-select-entrytype"
                  name="type"
                  defaultValue={form.type}
                  onChange={handleChange}
                  className="block w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-800 dark:text-white"
                >
                  {Object.values(EntryType).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              )}

              {form.type && (
                <>
                  <FormField
                    labelText="Image URL (Optional)"
                    fieldName="image_url"
                    fieldValue={form.image_url}
                    fieldType="url"
                    fieldPlaceholder="Image URL"
                    handleChange={handleChange}
                  />
                  <FormField
                    labelText="Title"
                    fieldName="title"
                    fieldValue={form.title}
                    fieldType="text"
                    fieldPlaceholder="Title"
                    handleChange={handleChange}
                  />

                  {form.type !== "software" && (
                    <>
                      <label
                        className="font-bold"
                        htmlFor={"abstract"}>
                        Abstract
                      </label>
                      <textarea
                        value={form.abstract}
                        name={"abstract"}
                        onChange={handleChange}
                        placeholder={"Abstract"}
                        className="dark:text-white">
                      </textarea>
                    </>
                  )}
                  {(form.type === "entry" ||
                    form.type === "entry-dictionary" ||
                    form.type === "hearing" ||
                    form.type === "legislation" ||
                    form.type === "bill" ||
                    form.type === "broadcast") && (
                    <FormField
                      labelText="Number"
                      fieldName="number"
                      fieldValue={form.number}
                      fieldType="text"
                      fieldPlaceholder="Number"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "motion_picture" || form.type === "song" || form.type === "graphic" || form.type === "figure" || form.type === "interview" || form.type === "broadcast") && (
                    <FormField
                      labelText="Medium"
                      fieldName="medium"
                      fieldValue={form.medium}
                      fieldType="text"
                      fieldPlaceholder="Medium"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "motion_picture" || form.type === "manuscript") && (
                    <FormField
                      labelText="Type"
                      fieldName="genre"
                      fieldValue={form.genre}
                      fieldType="text"
                      fieldPlaceholder="Genre"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "motion_picture" || form.type === "song" || form.type === "broadcast") && (
                    <FormField
                      labelText="Running Time"
                      fieldName="dimensions"
                      fieldValue={form.dimensions}
                      fieldType="text"
                      fieldPlaceholder="Running Time"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "graphic" || form.type === "figure") && (
                    <FormField
                      labelText="Artwork Size"
                      fieldName="dimensions"
                      fieldValue={form.dimensions}
                      fieldType="text"
                      fieldPlaceholder="Artwork Size"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "review") && (
                    <FormField
                      labelText="Reviewed Genre"
                      fieldName="reviewed-genre"
                      fieldValue={form["reviewed-genre"]}
                      fieldType="text"
                      fieldPlaceholder="Reviewed Genre"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "review" || form.type === "review-book") && (
                    <FormField
                      labelText="Reviewed Title"
                      fieldName="reviewed-title"
                      fieldValue={form["reviewed-title"]}
                      fieldType="text"
                      fieldPlaceholder="Reviewed Title"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "software") && (
                    <FormField
                      labelText="Version"
                      fieldName="version"
                      fieldValue={form.version}
                      fieldType="text"
                      fieldPlaceholder="Version"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "article-journal" ||
                    form.type === "article" ||
                    form.type === "chapter" ||
                    form.type === "article-magazine" ||
                    form.type === "article-newspaper" ||
                    form.type === "entry-encyclopedia" ||
                    form.type === "entry-dictionary" ||
                    form.type === "entry" ||
                    form.type === "webpage" ||
                    form.type === "map" ||
                    form.type === "motion_picture" ||
                    form.type === "paper-conference" ||
                    form.type === "software" ||
                    form.type === "review" ||
                    form.type === "review-book") && (
                    <FormField
                      labelText="Title From Where the Source Came From"
                      fieldName="container-title"
                      fieldValue={form["container-title"]}
                      fieldType="text"
                      fieldPlaceholder="Source Title"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "broadcast") && (
                    <FormField
                      labelText="Publication Title"
                      fieldName="container-title"
                      fieldValue={form["container-title"]}
                      fieldType="text"
                      fieldPlaceholder="Publication Title"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "legal_case") && (
                    <FormField
                      labelText="Reporter"
                      fieldName="container-title"
                      fieldValue={form["container-title"]}
                      fieldType="text"
                      fieldPlaceholder="Reporter"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "legal_case") && (
                    <FormField
                      labelText="Court"
                      fieldName="authority"
                      fieldValue={form.authority}
                      fieldType="text"
                      fieldPlaceholder="Court"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "bill" || form.type === "legislation") && (
                      <FormField
                        labelText="Code"
                        fieldName="container-title"
                        fieldValue={form["container-title"]}
                        fieldType="text"
                        fieldPlaceholder="Code"
                        handleChange={handleChange}
                      />
                    )}

                  {(form.type === "legislation") && (
                    <FormField
                      labelText="Code Number"
                      fieldName="volume"
                      fieldValue={form.volume}
                      fieldType="number"
                      fieldPlaceholder="Code Number"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "hearing") && (
                    <FormField
                      labelText="Committee"
                      fieldName="section"
                      fieldValue={form.section}
                      fieldType="number"
                      fieldPlaceholder="Committee"
                      handleChange={handleChange}
                    />
                  )}

                  {(form.type === "legislation") && (
                    <FormField
                      labelText="Section"
                      fieldName="section"
                      fieldValue={form.section}
                      fieldType="number"
                      fieldPlaceholder="Section"
                      handleChange={handleChange}
                    />
                  )}

                    {(form.type === "bill" || form.type === "hearing" || form.type === "legislation") && (
                      <FormField
                        labelText="Legislative Body"
                        fieldName="authority"
                        fieldValue={form.authority}
                        fieldType="text"
                        fieldPlaceholder="Legislative Body"
                        handleChange={handleChange}
                      />
                    )}

                      {(form.type === "bill" || form.type === "hearing" || form.type === "legislation") && (
                      <FormField
                        labelText="Session of Congress"
                        fieldName="chapter-number"
                        fieldValue={form['chapter-number']}
                        fieldType="number"
                        fieldPlaceholder="Ex. 100"
                        handleChange={handleChange}
                      />
                    )}

                  <div className="flex items-center justify-center pt-5">
                    <ContributorForm
                      updateFormData={updateFormData}
                      contributors={form.contributors}
                    />
                  </div>
                  {(form.type === "book" ||
                    form.type === "article-journal" ||
                    form.type === "article" ||
                    form.type === "map" ||
                    form.type === "paper-conference" ||
                    form.type === "review" ||
                    form.type === "song") && (
                    <FormField
                      labelText="Collection Title (series)"
                      fieldName="collection-title"
                      fieldValue={form["collection-title"]}
                      fieldType="text"
                      fieldPlaceholder="Series"
                      handleChange={handleChange}
                    />
                  )}
                </>
              )}

              {(form.type === "paper-conference") && (
                <FormField
                  labelText="Conference Name"
                  fieldName="event"
                  fieldValue={form.event}
                  fieldType="text"
                  fieldPlaceholder="Conference Name"
                  handleChange={handleChange}
                />
              )}

              {(form.type === "paper-conference") && (
                <FormField
                  labelText="Location (City)"
                  fieldName="eventPlaceCity"
                  fieldValue={form.eventPlaceCity}
                  fieldType="text"
                  fieldPlaceholder="City"
                  handleChange={handleChange}
                />
              )}

              {(form.type === "paper-conference") && (
                <FormField
                  labelText="Location (Country)"
                  fieldName="eventPlaceCountry"
                  fieldValue={form.eventPlaceCountry}
                  fieldType="text"
                  fieldPlaceholder="Country"
                  handleChange={handleChange}
                />
              )}

              {(form.type === "book" ||
                form.type === "chapter" ||
                form.type === "article-journal" ||
                form.type === "article" ||
                form.type === "article-magazine" ||
                form.type === "entry-encyclopedia" ||
                form.type === "entry-dictionary" ||
                form.type === "entry" ||
                form.type === "article-newspaper" ||
                form.type === "bill" ||
                form.type === "map" ||
                form.type === "paper-conference" ||
                form.type === "review" ||
                form.type === "legal_case" ||
                form.type === "manuscript" ||
                form.type === "review-book" ||
                form.type === "hearing" ||
                form.type === "legislation") && (
                <>
                  <FormField
                    labelText="Number of Pages"
                    fieldName="number-of-pages"
                    fieldValue={form["number-of-pages"]}
                    fieldType="number"
                    fieldPlaceholder="Number of Pages"
                    handleChange={handleChange}
                  />
                  <FormField
                    labelText="Page Range"
                    fieldName="page"
                    fieldValue={form["page"]}
                    fieldType="number"
                    fieldPlaceholder="Page range"
                    handleChange={handleChange}
                  />
                  <FormField
                    labelText="First page in range"
                    fieldName="page-first"
                    fieldValue={form["page-first"]}
                    fieldType="number"
                    fieldPlaceholder="First Page in range"
                    handleChange={handleChange}
                  />
                </>
              )}

              {(form.type === "book" ||
                form.type === "entry-encyclopedia" ||
                form.type === "entry-dictionary" ||
                form.type === "entry" ||
                form.type === "chapter" ||
                form.type === "article-journal" ||
                form.type === "article" ||
                form.type === "article-magazine" ||
                form.type === "bill" ||
                form.type === "map" ||
                form.type === "paper-conference" ||
                form.type === "review" ||
                form.type === "song" ||
                form.type === "review-book") && (
                <FormField
                  labelText="Volume"
                  fieldName="volume"
                  fieldValue={form.volume}
                  fieldType="number"
                  fieldPlaceholder="Volume"
                  handleChange={handleChange}
                />
              )}

              {form.type === "book" || form.type === "entry-dictionary" || form.type === "entry-encyclopedia" || form.type === "song" || form.type === "hearing" && (
                <FormField
                  labelText="Number of Volumes"
                  fieldName="number-of-volumes"
                  fieldValue={form["number-of-volumes"]}
                  fieldType="text"
                  fieldPlaceholder="Number of Volumes"
                  handleChange={handleChange}
                />
              )}

              {(form.type === "book" || form.type === "article-newspaper" || form.type === "chapter" || form.type === "entry-encyclopedia" || form.type === "entry-dictionary" ||
                form.type === "entry" || form.type === "map" || form.type === "paper-conference" || form.type === "song" || form.type === "manuscript" || form.type === "hearing"
                || form.type === "broadcast"
              ) && (
                <>
                  <FormField
                    labelText="Publisher City"
                    fieldName="publisherPlaceCity"
                    fieldValue={form.publisherPlaceCity}
                    fieldType="text"
                    fieldPlaceholder="Publisher City"
                    handleChange={handleChange}
                  />
                  <FormField
                    labelText="Publisher Country"
                    fieldName="publisherPlaceCountry"
                    fieldValue={form.publisherPlaceCountry}
                    fieldType="text"
                    fieldPlaceholder="Publisher Country"
                    handleChange={handleChange}
                  />
                </>
              )}

              {(form.type === "book" || form.type === "paper-conference" || form.type === "article-newspaper" || form.type === "chapter" || form.type === "entry-dictionary" || form.type === "entry-encyclopedia" || form.type === "entry" || form.type === "map") && (
                <FormField
                  labelText="Edition"
                  fieldName="edition"
                  fieldValue={form.edition}
                  fieldType="text"
                  fieldPlaceholder="Edition"
                  handleChange={handleChange}
                />
              )}

              {form.type && form.type !== "personal_communication" && form.type !== "legal_case" && (
                <FormField
                labelText="Publisher"
                fieldName="publisher"
                fieldValue={form.publisher}
                fieldType="text"
                fieldPlaceholder="Publisher"
                handleChange={handleChange}
              />
              )}

              {form.type && (
                <DatePicker
                  masterLabelText="Date Published (Month, Day, Year)"
                  labelText={["Month", "Day", "Year"]}
                  fieldName={[
                    "monthPublished",
                    "dayPublished",
                    "yearPublished",
                  ]}
                  fieldValue={[
                    form.monthPublished,
                    form.dayPublished,
                    form.yearPublished,
                  ]}
                  fieldType="text"
                  fieldPlaceholder="Pick a Date"
                  handleChange={handleChange}
                />
              )}

              {form.type && (
                <FormField
                  labelText="Source Accessed By URL "
                  fieldName="URL"
                  fieldValue={form.URL}
                  fieldType="url"
                  fieldPlaceholder="Source Accessed By URL"
                  handleChange={handleChange}
                />
              )}
              
              <DatePicker
                masterLabelText="Date Accessed (Month, Day, Year)"
                labelText={["Month", "Day", "Year"]}
                fieldName={["monthAccessed", "dayAccessed", "yearAccessed"]}
                fieldValue={[
                  form.monthAccessed,
                  form.dayAccessed,
                  form.yearAccessed,
                ]}
                fieldType="text"
                fieldPlaceholder="Pick a Date"
                handleChange={handleChange}
              />

              {form.type === "book" || form.type === "chapter" || form.type === "entry-dictionary" || form.type === "entry-encyclopedia" || form.type === "entry" && (
                <FormField
                  labelText="International Standard Book Number (ISBN)"
                  fieldName="ISBN"
                  fieldValue={form.ISBN}
                  fieldType="text"
                  fieldPlaceholder="ISBN"
                  handleChange={handleChange}
                />
              )}

              {(form.type === "article-journal" ||
                form.type === "article" ||
                form.type === "article-magazine" ||
                form.type === "review" ||
                form.type === "review-book") && (
                <FormField
                  labelText="Issue Number"
                  fieldName="number"
                  fieldValue={form.number}
                  fieldType="number"
                  fieldPlaceholder="Issue Number"
                  handleChange={handleChange}
                />
              )}

              {(form.type === "article" ||
                form.type === "article-journal"
              ) && (
                <FormField
                  labelText="Digital Object Identifier (DOI)"
                  fieldName="DOI"
                  fieldValue={form.DOI}
                  fieldType="text"
                  fieldPlaceholder="DOI"
                  handleChange={handleChange}
                />
              )}

              {(form.type === "article-journal" ||
                form.type === "article-magazine" ||
                form.type === "article" ||
                form.type === "article-newspaper") && (
                <FormField
                  labelText="International Standard Serial Number (ISSN)"
                  fieldName="ISSN"
                  fieldValue={form.ISSN}
                  fieldType="text"
                  fieldPlaceholder="ISSN"
                  handleChange={handleChange}
                />
              )}

              <button
                type="submit"
                className="mt-5 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
            <p className="text-center text-red-500">{message}</p>
            <ul className="list-disc pl-5">
              {Object.keys(errors).map((err, index) => (
                <li key={index} className="text-red-500">
                  {err}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
