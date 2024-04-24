import { Suspense } from 'react';
import { Contributor } from "../../models/Contributor";
import Form from "../../components/Form";
import { EntryType } from '../../components/Form';
import { ReferenceFormData } from '../../components/Form';

const NewReference = () => {
  const referenceForm = {
    type: '',
    /* Geographical location of archive (Will be converted into archive-place) */
    "archive-place": '',
    archivePlaceCity: '',
    archivePlaceCountry: '',
    /* Geographical location of event (Will be converted into event-place) */
    "event-place": '',
    eventPlaceCity: '',
    eventPlaceCountry: '',
    /* Geographical location of Original publisher place (Will be converted into original-publisher-place) */
    "original-publisher-place": null,
    origPubPlaceCity: '',
    origPubPlaceCountry: '',
    /* Geographical location of the current publisher place (Will be converted into publisher-place) */
    "publisher-place": '',
    publisherPlaceCity: '',
    publisherPlaceCountry: '',
    monthPublished: '',
    yearPublished: '',
    dayPublished: '',
    monthEvent: '',
    yearEvent: '',
    dayEvent: '',
    accessed: '',
    "available-date": '',
    "event-date": '',
    issued: '',
    "original-date": '',
    submitted: '',
    monthAccessed: '',
    yearAccessed: '',
    dayAccessed: '',
    monthAvailable: '',
    yearAvailable: '',
    dayAvailable: '',
    monthOriginal: '',
    yearOriginal: '',
    dayOriginal: '',
    monthSubmitted: '',
    yearSubmitted: '',
    daySubmitted: '',
    contributors: new Array<Contributor>(),
    abstract: '',
    annote: '',
    archive: '',
    archive_collection: '',
    archive_location: '',
    authority: '',
    "call-number": '',
    "citation-key": '', // Identifier for input data file
    "citation-label": '', // Identifier for in-text citation
    "collection-title": '', // i.e. Series title for a book
    "container-title": '', // i.e. Book title for a book chapter, journal title for a journal article
    dimensions: '',
    division: '',
    DOI: '',
    event: '', // Legacy. New version is event-title
    "event-title": '',
    genre: '',
    ISBN: '',
    ISSN: '',
    jurisdiction: '',
    keyword: '',
    language: '',
    license: '',
    medium: '',
    note: '',
    "original-publisher": '',
    "original-title": '',
    "part-title": '',
    PMCID: '',
    PMID: '',
    publisher: '',
    references: [],
    "reviewed-genre": '',
    "reviewed-title": '',
    scale: '',
    source: '',
    status: '',
    title: [],
    URL: '',
    "volume-title": '',
    "year-suffix": '',
    "chapter-number": '',
    "citation-number": '',
    "collection-number": '',
    edition: '',
    "first-reference-note-number": '',
    issue: '',
    locator: '',
    number: '',
    "number-of-pages": '',
    "number-of-volumes": '',
    page: '',
    "page-first": '',
    "part-number": '',
    "printing-number": '',
    section: '',
    "supplement-number": '',
    version: '',
    volume: '',
    author: '',
    chair: '',
    "collection-editor": '',
    compiler: '',
    composer: '',
    "container-author": '',
    contributor: '',
    curator: '',
    director: '',
    editor: '',
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
    running_time: '',
    format: '',
    image_url: '',
    api_source: '',
  };
  
  
  return <Suspense><Form formId="add-reference-form" /></Suspense>;
};

export default NewReference;