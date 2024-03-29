'use client'

import { CSLBibInterface } from "@/models/CSLBibTex";
import { Tag } from "@/models/Tag";
import { mutate } from "swr";

export async function applyTagsToReference(reference: CSLBibInterface, tags: Tag[]){
    /*Create the form*/
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
      short_title: reference.shorttitle,
      title: reference.title,
      type: reference.type,
      volume: reference.volume,
      doi: reference.doi,
      issn: reference.issn,
      isbn: reference.isbn,
      url: reference.url,
      running_time: reference.runningTime,
      format: reference.format,
      image_url: reference.image_url,
      issue: reference.issue,
      api_source: reference.apiSource,
      tags: reference.tags,
    };

    /*Put the proper data in the tag object*/
    for (let i = 0; i < tags.length; i++){
      reference.tags.push(tags[i]);
    }

    /*Send the new data to the API to be modified*/
    try {
        const res = await fetch(`/api/references/${reference._id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(referenceForm),
        });
  
        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
          throw new Error(res.status.toString());
        }
  
        const { data } = await res.json();
  
        mutate(`/api/references/${reference._id}`, data, true); // Update the local data without a revalidation
      } catch (error) {

      }
}

export async function applyReferencesToTag (tag: Tag, references: any[]) {
  /*Create the form*/
  const tagForm = {
      tagName: tag.tagName,
      tagColor: tag.tagColor,
      referenceID: tag.referenceID,
  };

  /*Put the proper data in the tag object*/
  for (let i = 0; i < references.length; i++){
    tag.referenceID.push(references[i]._id);
  }
  
  /*Send the new data to the API to be modified*/
  try {
      const res = await fetch(`/api/tags/${tag._id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tagForm),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      const { data } = await res.json();

      mutate(`/api/tags/${tag._id}`, data, true); // Update the local data without a revalidation
    } catch (error) {

    }
}

export default applyReferencesToTag;
