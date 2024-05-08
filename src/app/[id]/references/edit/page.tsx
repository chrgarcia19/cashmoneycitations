'use client'

import useSWR from "swr";
import Form from "@/components/Form";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export default function EditReference( {
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
){
  const id = searchParams.id;
  const {
    data: reference,
    error,
    isLoading,
  } = useSWR(id ? `/api/references/${id}` : null, fetcher);
  if (error) return <p>Failed to load</p>;
  if (isLoading) return <p>Loading...</p>;
  if (!reference) return null;

  // date-parts is ALWAYS [year, month, day]

  const referenceForm = {
    id: id,
    type: reference.type,
    archivePlaceCity: reference.archivePlaceCity,
    archivePlaceCountry: reference.archivePlaceCountry,
    eventPlaceCity: reference.eventPlaceCity,
    eventPlaceCountry: reference.eventPlaceCountry,
    publisherPlaceCity: reference.publisherPlaceCity,
    publisherPlaceCountry: reference.publisherPlaceCountry,
    "archive-place": reference['archive-place'],
    "event-place": reference['event-place'],
    "original-publisher-place": reference['original-publisher-place'],
    origPubPlaceCity: reference.origPubPlaceCity,
    origPubPlaceCountry: reference.origPubPlaceCountry,
    "publisher-place": reference["publisher-place"],
    "container-title": reference["container-title"],
    "collection-title": reference["collection-title"], // Series
    page: reference.page, // Range of pages
    "number-of-pages": reference["number-of-pages"], // Total # of pages
    volume: reference.volume, // Associated volume
    "number-of-volumes": reference["number-of-volumes"], // Total # of volumes
    edition: reference.edition,
    /* Date Fields */
    yearPublished: reference.yearPublished, // Date published
    monthPublished: reference.monthPublished, // Date published
    dayPublished: reference.dayPublished, // Date published
    yearAccessed: reference.yearAccessed, // Date accessed
    monthAccessed: reference.monthAccessed, // Date accessed
    dayAccessed: reference.dayAccessed, // Date accessed
    yearEvent: reference.yearEvent, // Date of event
    monthEvent: reference.monthEvent, // Date of event
    dayEvent: reference.dayEvent, // Date of event
    yearAvailable: reference.yearAvailable, // Date available
    monthAvailable: reference.monthAvailable, // Date available
    dayAvailable: reference.dayOriginal, // Date available
    yearOriginal: reference.yearOriginal, // Date of original
    monthOriginal: reference.monthOriginal, // Date of original
    dayOriginal: reference.dayOriginal, // Date of original
    yearSubmitted: reference.yearSubmitted, // Date submitted
    monthSubmitted: reference.monthSubmitted, // Date submitted
    daySubmitted: reference.daySubmitted, // Date submitted
    accessed: '',
    "available-date": '',
    "event-date": '',
    issued: '',
    "original-date": '',
    submitted: '',
    /* End Date Fields */
    annote: reference.annote,
    abstract: reference.abstract,
    archive: reference.archive,
    archive_collection: reference.archive_collection,
    archive_location: reference.archive_location,
    authority: reference.authority,
    "call-number": reference["call-number"],
    "citation-key": reference["citation-key"],
    "citation-label": reference["citation-label"],
    dimensions: reference.dimensions,
    division: reference.division,
    genre: reference.genre,
    jurisdiction: reference.jurisdiction,
    keyword: reference.keyword,
    language: reference.language,
    license: reference.license,
    medium: reference.medium,
    "original-publisher": reference["original-publisher"],
    "original-title": reference["original-title"],
    "part-title": reference["part-title"],
    PMCID: reference.PMCID,
    PMID: reference.PMID,
    references: reference.references,
    "reviewed-genre": reference["reviewed-genre"],
    "reviewed-title": reference["reviewed-title"],
    scale: reference.scale,
    source: reference.source,
    status: reference.status,
    "volume-title": reference["volume-title"],
    "year-suffix": reference["year-suffix"],
    "chapter-number": reference["chapter-number"],
    "citation-number": reference["citation-number"],
    "collection-number": reference["collection-number"],
    "first-reference-note-number": reference["first-reference-note-number"],
    issue: reference.issue,
    locator: reference.locator,
    number: reference.number,
    "page-first": reference["page-first"],
    "part-number": reference["part-number"],
    "printing-number": reference["printing-number"],
    "supplement-number": reference["supplement-number"],
    version: reference.version,    
    section: reference.section,
    contributors: reference.contributors,
    editor: reference.editor,
    note: reference.note,
    publisher: reference.publisher,
    title: reference.title,
    DOI: reference.DOI,
    ISSN: reference.ISSN,
    ISBN: reference.ISBN,
    URL: reference.URL,
    organization: reference.organizer,
    author: '',
    chair: '',
    "collection-editor": '',
    compiler: '',
    composer: '',
    "container-author": '',
    contributor: '',
    curator: '',
    director: '',
    "editorial-director": '',
    "editor-translator": '',
    "executive-producer": '',
    guest: '',
    host: '',
    illustrator: '',
    interviewer: '',
    narrator: '',
    organizer: '',
    "original-author": '',
    performer: '',
    producer: '',
    recipient: '',
    "reviewed-author": '',
    "script-writer": '',
    "series-creator": '',
    translator: '',
    running_time: reference.running_time,
    format: reference.format,
    image_url: reference.image_url,
    api_source: reference.api_source,
  };

  return (
    <Form formId={"edit-reference-form"} referenceForm={referenceForm} forNewReference={false}/>
  )
};