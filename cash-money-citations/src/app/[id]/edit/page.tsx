'use client'

import useSWR from "swr";
import Form from "@/components/Form";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export function EditReference( {
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
    location: reference.location,
    annote: reference.annote,
    contributors: reference.contributors,
    indextitle: reference.indextitle,
    chapter: reference.chapter,
    edition: reference.edition,
    editor: reference.editor,
    howpublished: reference.howpublished,
    institution: reference.institution,
    month_published: reference.month_published,
    day_published: reference.day_published,
    year_published: reference.year_published,
    month_accessed: reference.month_accessed,
    day_accessed: reference.day_accessed,
    year_accessed: reference.year_accessed,
    month_event: reference.month_event,
    day_event: reference.day_event,
    year_event: reference.year_event,
    note: reference.note,
    number: reference.number,
    organization: reference.organization,
    pages: reference.pages,
    publisher: reference.publisher,
    school: reference.school,
    series: reference.series,
    volumes: reference.volumes,
    short_title: reference.short_title,
    title: reference.title,
    type: reference.type,
    volume: reference.volume,
    doi: reference.doi,
    issn: reference.issn,
    isbn: reference.isbn,
    url: reference.url,
    running_time: reference.running_time,
    format: reference.format,
    image_url: reference.image_url,
    issue: reference.issue,
    api_source: reference.api_source,
  };

  return (
    <Form formId={"edit-reference-form"} referenceForm={referenceForm} forNewReference={false}/>
  )
};

export default EditReference;