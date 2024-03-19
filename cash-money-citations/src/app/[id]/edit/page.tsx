'use client'

import useSWR from "swr";
import WebForm from "@/components/form-components/WebForm";
import BookForm from "@/components/form-components/BookForm";
import JournalForm from "@/components/form-components/JournalForm";
import MagazineForm from "@/components/form-components/MagazineForm";
import NewspaperForm from "@/components/form-components/NewspaperForm";
import DatabaseForm from "@/components/form-components/DatabaseForm";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export default function EditReference( {
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
){
  const id = searchParams.id;
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
      issn: reference.issn,
    }

    return <JournalForm formID={"edit-journal-form"} journalForm={journalForm} forNewReference={false} />
  } else if (referenceForm.type == "magazine"){
    const magazineForm = {
      type: "magazine",
      citekey: reference.citekey,
      image_url: reference.image_url,
      contributors: reference.contributors,
      source_title: reference.source_title,
      magazine_title: reference.magazine_title,
      volume: reference.volume,
      issue: reference.issue,
      month_published: reference.month_published,
      day_published: reference.day_published,
      year_published: reference.year_published,
      start_page: reference.start_page,
      end_page: reference.end_page,
      doi: reference.doi,
      issn: reference.issn,
    }

    return <MagazineForm formID={"edit-magazine-form"} magazineForm={magazineForm} forNewReference={false} />
  } else if (referenceForm.type == "newspaper"){
    const newspaperForm = {
      type: "newspaper",
      citekey: reference.citekey,
      image_url: reference.image_url,
      contributors: reference.contributors,
      source_title: reference.source_title,
      newspaper_title: reference.newspaper_title,
      edition: reference.edition,
      section: reference.section,
      city: reference.city,
      month_published: reference.month_published,
      day_published: reference.day_published,
      year_published: reference.year_published,
      start_page: reference.start_page,
      end_page: reference.end_page,
      issn: reference.issn,
    }

    return <NewspaperForm formID={"edit-newspaper-form"} newspaperForm={newspaperForm} forNewReference={false} />
  } else if (referenceForm.type == "database"){
    const databaseForm = {
      type: "database",
      citekey: reference.citekey,
      image_url: reference.image_url,
      contributors: reference.contributors,
      source_title: reference.source_title,
      library: reference.library,
      database: reference.database,
      database_url: reference.database_url,
      city: reference.city,
      month_accessed: reference.month_accessed,
      day_accessed: reference.day_accessed,
      year_accessed: reference.year_accessed,
      month_published: reference.month_published,
      day_published: reference.day_published,
      year_published: reference.year_published,
      service: reference.service,
      issn: reference.issn,
    }

    return <DatabaseForm formID={"edit-database-form"} databaseForm={databaseForm} forNewReference={false} />
  }
};

export default EditReference;

