import { useRouter } from "next/router";
import useSWR from "swr";
import Form from "../../components/Form";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

const EditReference = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: reference,
    error,
    isLoading,
  } = useSWR(id ? `/api/references/${id}` : null, fetcher);

  if (error) return <p>Failed to load</p>;
  if (isLoading) return <p>Loading...</p>;
  if (!reference) return null;

  const referenceForm = {
    type: reference.type,
    citekey: reference.citekey,
    title: reference.title,
    authorFirstName: reference.authorFirstName,
    authorLastName: reference.authorLastName,
    authorMiddleInitial: reference.authorMiddleInitial,
    publisher: reference.publisher,
    year: reference.year,
    month: reference.month,
    address: reference.address,
    edition: reference.edition,
    volume: reference.volume,
    isbn: reference.isbn,
    doi: reference.doi,
    pages: reference.pages,
    journal: reference.journal,
    image_url: reference.image_url,
  };

  return <Form formId="edit-reference-form" referenceForm={referenceForm} forNewReference={false} />;
};

export default EditReference;
