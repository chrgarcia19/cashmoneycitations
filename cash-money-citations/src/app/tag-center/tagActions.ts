'use client'

import { References } from "@/models/Reference";
import { Tag } from "@/models/Tag";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export async function applyTagsToReference(reference: References, tags: any[]){
    /*Create the form*/
    const referenceForm = {
        type: reference.type,
        citekey: reference.citekey,
        title: reference.title,
        contributors: reference.contributors,
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
        tagID: reference.tagID,
    };

    console.log(JSON.stringify(tags));

    /*Put the proper data in the tag object*/
    for (let i = 0; i < tags.length; i++){
      referenceForm.tagID.push(tags[i]._id);
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

const applyReferencesToTag = async (tag: Tag, references: any[]) =>{
  /*Create the form*/
  const tagForm = {
      tagName: tag.tagName,
      tagColor: tag.tagColor,
      referenceID: tag.referenceID,
  };

  /*Put the proper data in the tag object*/
  for (let i = 0; i < references.length; i++){
    tagForm.referenceID.push(references[i]._id);
  }
  
  console.log(JSON.stringify(tagForm));
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
