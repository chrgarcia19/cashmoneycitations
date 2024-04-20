'use client'

import { CSLBibInterface } from "@/models/CSLBibTex";
import { Tag } from "@/models/Tag";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

export async function applyTagsToReference(reference: any, tags: Tag[]){
    /*Create the form*/
    const referenceForm = {
      tagId: reference.tagId,
    };

    /*Put the proper data in the tag object*/
    for (let i = 0; i < tags.length; i++){
      referenceForm.tagId.push(tags[i]._id);
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

export async function applyReferencesToTag (tag: Tag, refs: CSLBibInterface[]) {
  /*Create the form*/
  const tagForm = {
      tagName: tag.tagName,
      tagColor: tag.tagColor,
      referenceId: tag.referenceId,
  };

  /*Put the proper data in the tag object*/
  for (let i = 0; i < refs.length; i++){
    tagForm.referenceId.push(refs[i]._id);
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

export const handleDelete = async (tagId: string, references: CSLBibInterface[], router: AppRouterInstance) => {
  for (let i = 0; i < references.length; i++){
    deleteTagIdFromReference(tagId, references[i]);
  }
  
  try {
    await fetch(`/api/tags/${tagId}`, {
      method: "Delete",
    });
    router.push('/tag-center');
    router.refresh();
  } catch (error) {
  }
};

export async function deleteTagIdFromReference(tagId: string, reference: CSLBibInterface) {
  /*Create the form*/  
  const referenceForm = {
    tagId: reference.tagId,
  };

  /*Find the index of the selected tag*/
  const index = referenceForm.tagId.indexOf(tagId);
  /*Splice the index and only remove 1 item*/
  referenceForm.tagId.splice(index, 1);

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
    console.log("Reference not modified!");
  } 
}

export async function deleteReferenceIdFromTag(referenceId: string, tag: Tag) {
  /*Create the form*/
  const tagForm = {
    tagName: tag.tagName,
    tagColor: tag.tagColor,
    referenceId: tag.referenceId,
};

  /*Find the index of the selected tag*/
  const index = tagForm.referenceId.indexOf(referenceId);
  /*Splice the index and only remove 1 item*/
  tagForm.referenceId.splice(index, 1);

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
    console.log("Tag not modified!");
  } 
}
