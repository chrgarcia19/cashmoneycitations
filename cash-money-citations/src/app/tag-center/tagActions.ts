'use client'

import { CSLBibInterface } from "@/models/CSLBibTex";
import { Tag } from "@/models/Tag";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

export async function applyTagsToReference(reference: any, tags: Tag[]){
    /*Create the form*/
    const referenceForm = {
      // type: reference.type,
      // archivePlaceCity: reference.archivePlaceCity,
      // archivePlaceCountry: reference.archivePlaceCountry,
      // eventPlaceCity: reference.eventPlaceCity,
      // eventPlaceCountry: reference.eventPlaceCountry,
      // publisherPlaceCity: reference.publisherPlaceCity,
      // publisherPlaceCountry: reference.publisherPlaceCountry,
      // "archive-place": reference['archive-place'],
      // "event-place": reference['event-place'],
      // "original-publisher-place": reference['original-publisher-place'],
      // origPubPlaceCity: reference.origPubPlaceCity,
      // origPubPlaceCountry: reference.origPubPlaceCountry,
      // "publisher-place": reference["publisher-place"],
      // "container-title": reference["container-title"],
      // "collection-title": reference["collection-title"], // Series
      // page: reference.page, // Range of pages
      // "number-of-pages": reference["number-of-pages"], // Total # of pages
      // volume: reference.volume, // Associated volume
      // "number-of-volumes": reference["number-of-volumes"], // Total # of volumes
      // edition: reference.edition,
      // /* Date Fields */
      // yearPublished: reference.yearPublished, // Date published
      // monthPublished: reference.monthPublished, // Date published
      // dayPublished: reference.dayPublished, // Date published
      // yearAccessed: reference.yearAccessed, // Date accessed
      // monthAccessed: reference.monthAccessed, // Date accessed
      // dayAccessed: reference.dayAccessed, // Date accessed
      // yearEvent: reference.yearEvent, // Date of event
      // monthEvent: reference.monthEvent, // Date of event
      // dayEvent: reference.dayEvent, // Date of event
      // yearAvailable: reference.yearAvailable, // Date available
      // monthAvailable: reference.monthAvailable, // Date available
      // dayAvailable: reference.dayOriginal, // Date available
      // yearOriginal: reference.yearOriginal, // Date of original
      // monthOriginal: reference.monthOriginal, // Date of original
      // dayOriginal: reference.dayOriginal, // Date of original
      // yearSubmitted: reference.yearSubmitted, // Date submitted
      // monthSubmitted: reference.monthSubmitted, // Date submitted
      // daySubmitted: reference.daySubmitted, // Date submitted
      // accessed: '',
      // "available-date": '',
      // "event-date": '',
      // issued: '',
      // "original-date": '',
      // submitted: '',
      // /* End Date Fields */
      // annote: reference.annote,
      // abstract: reference.abstract,
      // archive: reference.archive,
      // archive_collection: reference.archive_collection,
      // archive_location: reference.archive_location,
      // authority: reference.authority,
      // "call-number": reference["call-number"],
      // "citation-key": reference["citation-key"],
      // "citation-label": reference["citation-label"],
      // dimensions: reference.dimensions,
      // division: reference.division,
      // genre: reference.genre,
      // jurisdiction: reference.jurisdiction,
      // keyword: reference.keyword,
      // language: reference.language,
      // license: reference.license,
      // medium: reference.medium,
      // "original-publisher": reference["original-publisher"],
      // "original-title": reference["original-title"],
      // "part-title": reference["part-title"],
      // PMCID: reference.PMCID,
      // PMID: reference.PMID,
      // references: reference.references,
      // "reviewed-genre": reference["reviewed-genre"],
      // "reviewed-title": reference["reviewed-title"],
      // scale: reference.scale,
      // source: reference.source,
      // status: reference.status,
      // "volume-title": reference["volume-title"],
      // "year-suffix": reference["year-suffix"],
      // "chapter-number": reference["chapter-number"],
      // "citation-number": reference["citation-number"],
      // "collection-number": reference["collection-number"],
      // "first-reference-note-number": reference["first-reference-note-number"],
      // issue: reference.issue,
      // locator: reference.locator,
      // number: reference.number,
      // "page-first": reference["page-first"],
      // "part-number": reference["part-number"],
      // "printing-number": reference["printing-number"],
      // "supplement-number": reference["supplement-number"],
      // version: reference.version,    
      // section: reference.section,
      // contributors: reference.contributors,
      // editor: reference.editor,
      // note: reference.note,
      // publisher: reference.publisher,
      // title: reference.title,
      // DOI: reference.DOI,
      // ISSN: reference.ISSN,
      // ISBN: reference.ISBN,
      // URL: reference.URL,
      // organization: reference.organizer,
      // author: '',
      // chair: '',
      // "collection-editor": '',
      // compiler: '',
      // composer: '',
      // "container-author": '',
      // contributor: '',
      // curator: '',
      // director: '',
      // "editorial-director": '',
      // "editor-translator": '',
      // "executive-producer": '',
      // guest: '',
      // host: '',
      // illustrator: '',
      // interviewer: '',
      // narrator: '',
      // organizer: '',
      // "original-author": '',
      // performer: '',
      // producer: '',
      // recipient: '',
      // "reviewed-author": '',
      // "script-writer": '',
      // "series-creator": '',
      // translator: '',
      // runningTime: reference.runningTime,
      // format: reference.format,
      // image_url: reference.image_url,
      // apiSource: reference.apiSource,
      tagID: reference.tagID,
    };

    /*Put the proper data in the tag object*/
    for (let i = 0; i < tags.length; i++){
      referenceForm.tagID.push(tags[i]._id);
    }

    /*Send the new data to the API to be modified*/
    try {
        const res = await fetch(`/api/references/${reference._id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(referenceForm),
        });
  
        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
          throw new Error(res.status.toString());
        }
  
        const { data } = await res.json();
  
        mutate(`/api/references/${reference._id}`, data, true); // Update the local data without a revalidation
      } catch (error) {

      }
}

export async function applyReferencesToTag (tag: Tag, refs: CSLBibInterface[]) {
  /*Create the form*/
  const tagForm = {
      tagName: tag.tagName,
      tagColor: tag.tagColor,
      referenceID: tag.referenceID,
  };

  /*Put the proper data in the tag object*/
  for (let i = 0; i < refs.length; i++){
    tagForm.referenceID.push(refs[i]._id);
  }
  
  /*Send the new data to the API to be modified*/
  try {
      const res = await fetch(`/api/tags/${tag._id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tagForm),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      const { data } = await res.json();

      mutate(`/api/tags/${tag._id}`, data, true); // Update the local data without a revalidation
    } catch (error) {

    }
}

export const handleDelete = async (tagID: string, references: CSLBibInterface[], router: AppRouterInstance) => {
  for (let i = 0; i < references.length; i++){
    deleteTagIdFromReference(tagID, references[i]);
  }
  
  try {
    await fetch(`/api/tags/${tagID}`, {
      method: "Delete",
    });
    router.push('/tag-center');
    router.refresh();
  } catch (error) {
  }
};

export async function deleteTagIdFromReference(tagId: string, reference: CSLBibInterface) {
  /*Create the form*/  
  const referenceForm = {
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
    runningTime: reference.runningTime,
    format: reference.format,
    image_url: reference.image_url,
    apiSource: reference.apiSource,
    tagID: reference.tagID,
  };

  /*Find the index of the selected tag*/
  const index = referenceForm.tagID.indexOf(tagId);
  /*Splice the index and only remove 1 item*/
  referenceForm.tagID.splice(index, 1);

  /*Send the new data to the API to be modified*/
  try {
    const res = await fetch(`/api/references/${reference._id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(referenceForm),
    });

    // Throw error with status code in case Fetch API req failed
    if (!res.ok) {
      throw new Error(res.status.toString());
    }

    const { data } = await res.json();

    mutate(`/api/references/${reference._id}`, data, true); // Update the local data without a revalidation
  } catch (error) {
    console.log("Reference not modified!");
  } 
}

export async function deleteReferenceIdFromTag(referenceId: string, tag: Tag) {
  /*Create the form*/
  const tagForm = {
    tagName: tag.tagName,
    tagColor: tag.tagColor,
    referenceID: tag.referenceID,
};

  /*Find the index of the selected tag*/
  const index = tagForm.referenceID.indexOf(referenceId);
  /*Splice the index and only remove 1 item*/
  tagForm.referenceID.splice(index, 1);

  /*Send the new data to the API to be modified*/
  try {
    const res = await fetch(`/api/tags/${tag._id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tagForm),
    });

    // Throw error with status code in case Fetch API req failed
    if (!res.ok) {
      throw new Error(res.status.toString());
    }

    const { data } = await res.json();

    mutate(`/api/tags/${tag._id}`, data, true); // Update the local data without a revalidation
  } catch (error) {
    console.log("Tag not modified!");
  } 
}
