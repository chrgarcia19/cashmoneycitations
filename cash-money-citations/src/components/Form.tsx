import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";

interface FormData {
  type: string;
  citekey: string;
  title: string;
  authorFirstName: string;
  authorLastName: string;
  authorMiddleInitial: string;
  publisher: string;
  year: string;
  month: string;
  address: string;
  edition: string;
  volume: string;
  isbn: string;
  doi: string;
  pages: string;
  journal: string;
  image_url: string;
}

interface Error {
  type?: string;
  citekey?: string;
  title?: string;
  authorFirstName?: string;
  authorLastName?: string;
  publisher?: string;
  year?: string;
  image_url?: string;
}

type Props = {
  formId: string;
  referenceForm: FormData;
  forNewReference?: boolean;
};

const Form = ({ formId, referenceForm, forNewReference = true }: Props) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    type: referenceForm.type,
    citekey: referenceForm.citekey,
    title: referenceForm.title,
    authorFirstName: referenceForm.authorFirstName,
    authorLastName: referenceForm.authorLastName,
    authorMiddleInitial: referenceForm.authorMiddleInitial,
    publisher: referenceForm.publisher,
    year: referenceForm.year,
    month: referenceForm.month,
    address: referenceForm.address,
    edition: referenceForm.edition,
    volume: referenceForm.volume,
    isbn: referenceForm.isbn,
    doi: referenceForm.doi,
    pages: referenceForm.pages,
    journal: referenceForm.journal,
    image_url: referenceForm.image_url,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form: FormData) => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/references/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      const { data } = await res.json();

      mutate(`/api/references/${id}`, data, false); // Update the local data without a revalidation
      router.push("/");
    } catch (error) {
      setMessage("Failed to update reference");
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form: FormData) => {
    try {
      const res = await fetch("/api/references", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      router.push("/");
    } catch (error) {
      setMessage("Failed to add reference");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  const formValidate = () => {
    let err: Error = {};
    if (!form.type) err.type = "Type is required";
    if (!form.citekey) err.citekey = "Citekey is required";
    if (!form.title) err.title = "Title is required";
    if (!form.authorFirstName) err.authorFirstName = "Author Name is required";
    if (!form.authorLastName) err.authorLastName = "Author Name is required";
    if (!form.publisher) err.publisher = "Publisher is required";
    if (!form.year) err.year = "Year is required";
    if (!form.image_url) err.image_url = "Image URL is required";
    return err;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = formValidate();

    if (Object.keys(errs).length === 0) {
      forNewReference ? postData(form) : putData(form);
    } else {
      setErrors({ errs });
    }
  };

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>

        <label htmlFor="type">Type</label>
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="" selected disabled hidden>Choose here</option>
          <option value="website">Website</option>
          <option value="book">Book</option>
          <option value="journal">Journal</option>
        </select>

        <label htmlFor="citekey">Citekey</label>
        <input
          type="text"
          name="citekey"
          value={form.citekey}
          onChange={handleChange}
          required
        />

        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="authorFirstName">Author's First Name</label>
        <input
          type="text"
          name="authorFirstName"
          value={form.authorFirstName}
          onChange={handleChange}
          required
        />

        <label htmlFor="authorMiddleInitial">Author's Middle Initial</label>
        <input
          type="text"
          name="authorMiddleInitial"
          value={form.authorMiddleInitial}
          onChange={handleChange}
          required
        />

        <label htmlFor="authorLastName">Author's Last Name</label>
        <input
          type="text"
          name="authorLastName"
          value={form.authorLastName}
          onChange={handleChange}
          required
        />

        <label htmlFor="publisher">Publisher</label>
        <input
          type="text"
          name="publisher"
          value={form.publisher}
          onChange={handleChange}
          required
        />

        <label htmlFor="year">Year</label>
        <input
          type="text"
          name="year"
          value={form.year}
          onChange={handleChange}
          required
        />

        <label htmlFor="month">Month</label>
        <input
          type="text"
          name="month"
          value={form.month}
          onChange={handleChange}
        />

        <label htmlFor="address">Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <label htmlFor="edtion">Edition</label>
        <input
          type="text"
          name="edition"
          value={form.edition}
          onChange={handleChange}
        />

        <label htmlFor="volume">Volume</label>
        <input
          type="text"
          name="volume"
          value={form.volume}
          onChange={handleChange}
        />

        <label htmlFor="isbn">ISBN</label>
        <input
          type="text"
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
        />

        <label htmlFor="doi">DOI</label>
        <input
          type="text"
          name="doi"
          value={form.doi}
          onChange={handleChange}
        />

        <label htmlFor="pages">Pages</label>
        <input
          type="text"
          name="pages"
          value={form.pages}
          onChange={handleChange}
        />

        <label htmlFor="journal">Journal</label>
        <input
          type="text"
          name="journal"
          value={form.journal}
          onChange={handleChange}
        />

        <label htmlFor="image_url">Image URL</label>
        <input
          type="url"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      <p>{message}</p>
      <div>
        {Object.keys(errors).map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </div>
    </>
  );
};

export default Form;
