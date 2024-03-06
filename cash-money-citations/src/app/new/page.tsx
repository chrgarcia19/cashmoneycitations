import { Suspense } from 'react';
import { Contributor } from "@/models/Contributor";
import Form from "../../components/Form";

const NewReference = () => {
  const referenceForm = {
    type: "",
    citekey: "",
    title: "",
    contributors: new Array<Contributor>(),
    publisher: "",
    year_published: "",
    day_published: 0,
    month_published: "",
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