import { Suspense } from 'react';
import { Contributor } from "@/models/Contributor";
import Form from "../../components/Form";

const NewReference = () => {
  const referenceForm = {
    type: "",
  };
  return <Suspense><Form formId="add-reference-form" referenceForm={referenceForm} /></Suspense>;
  
};

export default NewReference;