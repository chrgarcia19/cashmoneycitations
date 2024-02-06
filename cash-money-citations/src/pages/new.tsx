import Form from "../components/Form";

const NewReference = () => {
  const referenceForm = {
    type: "",
    citekey: "",
    title: "",
    contributors: new Array(),
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

  return <Form formId="add-reference-form" referenceForm={referenceForm} />;
};

export default NewReference;
