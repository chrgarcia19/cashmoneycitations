import { Suspense } from 'react';
import { Contributor } from "@/models/Contributor";
import Form from "../../components/Form";
import { EntryType } from '../../components/Form';

const NewReference = () => {
  const referenceForm = {
    entryType: {
      type: '',
      enum: EntryType,
    },
    address: "",
    annote: "",
    contributors: new Array<Contributor>(),
    website_title: "",
    chapter: "",
    edition: "",
    editor: "",
    howpublished: "",
    institution: "",
    journal: "",
    /*The next three fields are later
    converted into a date object*/
    month_published: "",
    day_published: "",
    year_published: "",
    /*The next three fields are later
    converted into a date object*/
    month_accessed: "",
    day_accessed: "",
    year_accessed: "",
    /*The next three fields are later
    converted into a date object*/
    month_event: "",
    day_event: "",
    year_event: "",
    /*The next three fields are later
    converted into a date object*/
    month_orig: "",
    day_orig: "",
    year_orig: "",
    month: "",
    year: "",
    note: "",
    number: 0,
    organization: "",
    pages: "",
    publisher: "",
    school: "",
    series: "",
    volumes: "",
    short_title: "",
    title: [''] as [string],
    type: "",
    volume: 0,
    doi: "",
    issn: [''] as [string],
    isbn: "",
    url: "",
    rights: "",
    runningTime: "",
    format: "",
    image_url: "",
    issue: "",
    apiSource: "",
  };
  return <Suspense><Form formId="add-reference-form" referenceForm={referenceForm} /></Suspense>;
  
};

export default NewReference;