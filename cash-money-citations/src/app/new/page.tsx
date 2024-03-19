import { Suspense } from 'react';
import { Contributor } from "@/models/Contributor";
import Form from "../../components/Form";

const NewReference = () => {
  const referenceForm = {
    entryType: '',
    citekey: "",
    title: "",
    contributors: new Array<Contributor>(),
    publisher: "",
    year: "",
    month: "",
    address: "",
    edition: "",
    volume: "",
    isbn: "",
    doi: "",
    pages: "",
    journal: "",
    image_url: "",
  };
  return <Suspense><Form formId="add-reference-form" referenceForm={referenceForm} /></Suspense>;
  
};

export default NewReference;