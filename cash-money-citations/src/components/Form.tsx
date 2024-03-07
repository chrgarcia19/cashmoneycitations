'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mutate } from "swr";
import useSWR from "swr";
import ContributorForm from "./ContributorForm";
import { Contributor } from "@/models/Contributor";
import WebForm from "./form-components/WebForm";
import BookForm from "./form-components/BookForm";

interface FormData {
  type: string;
}

interface Error {
  type?: string;
  citekey?: string;
  title?: string;
  contributors?: string;
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

  const webData = {
    type: "",
    citekey: "",
    image_url: "",
    contributors: new Array<Contributor>(),
    source_title: "",
    website_title: "",
    website_url: "",
    month_accessed: "",
    day_accessed: "",
    year_accessed: "",
    month_published: "",
    day_published: "",
    year_published: "",
    publisher: "",
  };

  const bookData = {
    type: "book",
    citekey: "",
    image_url: "",
    contributors: new Array<Contributor>(),
    source_title: "",
    volume: "",
    edition: "",
    month_published: "",
    day_published: "",
    year_published: "",
    publisher: "",
    city: "",
    state: "",
  };

  /*Set initial state to website so the page is not blank*/
  const [form, setForm] = useState({
    type: "website",
  });

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

  let formTitle: String;
  if (form.type) {
    formTitle = "Edit Reference"
  }
  else {
    formTitle = "Add Reference"
  }

  return (
    <>
    <div className="pt-5 pb-5 w-full flex items-center justify-center">
      <div className="bg-gray-100 w-2/5 rounded-xl">
        <div className="flex justify-center items-center">
          <h1 className="text-2xl align-middle pl-">{formTitle}</h1>
        </div>
        <div className="pl-14">
          <label className="font-bold" htmlFor="type">
            Type
          </label>
          <select 
            name="type" 
            className="bg-white border-gray-300 rounded-lg w-52 h-8 border-t border-r border-l border-b" 
            defaultValue={form.type} 
            onChange={handleChange} 
            required>
            <option value="" disabled hidden>Choose here</option>
            <option value="website">Website</option>
            <option value="book">Book</option>
            <option value="journal">Journal</option>
          </select>
        </div>
        <br/>

            {form.type == "website" && (
              <WebForm formID={"add-web-reference"} type={"website"} webForm={webData}  />
            )}

            {form.type == "book" && (
              <BookForm formID={"add-book-reference"} type={"book"} bookForm={bookData} />
            )}
        </div>
      </div>
    </>
  );
};

export default Form;