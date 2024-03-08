'use client'

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import WebForm from "@/components/form-components/WebForm";
import BookForm from "@/components/form-components/BookForm";
import JournalForm from "@/components/form-components/JournalForm";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

const EditReference = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
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
  };

  if (referenceForm.type == "website"){

    const webForm = {
      type: reference.type,
      citekey: reference.citekey,
      image_url: reference.image_url,
      contributors: reference.contributors,
      source_title: reference.source_title,
      website_title: reference.website_title,
      website_url: reference.website_url,
      month_accessed: reference.month_accessed,
      day_accessed: reference.day_accessed,
      year_accessed: reference.year_accessed,
      month_published: reference.month_published,
      day_published: reference.day_published,
      year_published: reference.year_published,
      publisher: reference.publisher,
    };
    
    return <WebForm formID={"edit-web-form"} webForm={webForm} forNewReference={false} />
  } else if (referenceForm.type == "book") {
    const bookForm = {
      type: reference.type,
      citekey: reference.citekey,
      image_url: reference.image_url,
      contributors: reference.contributors,
      source_title: reference.source_title,
      volume: reference.volume,
      edition: reference.edition,
      month_published: reference.month_published,
      day_published: reference.day_published,
      year_published: reference.year_published,
      publisher: reference.publisher,
      city: reference.city,
      state: reference.state,
      isbn: reference.isbn,
    }

    return <BookForm formID={"edit-book-form"} bookForm={bookForm} forNewReference={false} />
  } else if (referenceForm.type == "journal"){
    const journalForm = {
      type: "journal",
      citekey: reference.citekey,
      image_url: reference.image_url,
      contributors: reference.contributors,
      source_title: reference.source_title,
      journal_title: reference.journal_title,
      volume: reference.volume,
      issue: reference.issue,
      month_published: reference.month_published,
      day_published: reference.day_published,
      year_published: reference.year_published,
      start_page: reference.start_page,
      end_page: reference.end_page,
      doi: reference.doi,
    }

    return <JournalForm formID={"edit-journal-form"} journalForm={journalForm} forNewReference={false} />
  }
};

export default EditReference;