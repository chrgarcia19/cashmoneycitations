'use client'

import { CSLBibInterface } from "@/models/CSLBibTex";
import { Group } from "@/models/Group";
import { mutate } from "swr";

export async function applyGroupsToReference(reference: CSLBibInterface, groups: Group[]){
    /*Create the form*/
    const referenceForm = {
        groupId: reference.groupId,
    };

    /*Put the group id in the reference*/
    for (let i = 0; i < groups.length; i++){
        referenceForm.groupId.push(groups[i]._id);
    }

    /*Send the modified data to the API to be updated*/
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
        console.log("Error modifying reference!");
      }
}

export async function applyReferencesToGroup(group: Group, references: CSLBibInterface[]){
    /*Create the form*/
    const groupForm = {
        referenceId: group.referenceId,
    }

    /*Put the reference ids in the group*/
    for (let i = 0; i < references.length; i++){
        groupForm.referenceId.push(references[i]._id);
    }

    /*Send the modified data to the API to be updated*/
    try {
        const res = await fetch(`/api/groups/${group._id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(groupForm),
        });
  
        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
          throw new Error(res.status.toString());
        }
  
        const { data } = await res.json();
  
        mutate(`/api/groups/${group._id}`, data, true); // Update the local data without a revalidation
      } catch (error) {
        console.log("Error modifying group!");
      }
}