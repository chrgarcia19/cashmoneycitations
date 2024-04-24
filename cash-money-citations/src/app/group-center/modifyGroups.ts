'use client'

import { CSLBibInterface } from "@/models/CSLBibTex";
import { Group } from "@/models/Group";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { mutate } from "swr";

export async function applyGroupToReferences(reference: CSLBibInterface, group: Group){
    /*Create the form*/
    const referenceForm = {
        groupId: reference.groupId,
    };

    /*Put the group id in the reference*/
    referenceForm.groupId.push(group._id);

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

export async function applyReferencesToGroup(group: Group, referenceIds: string){
    /*Create the form*/
    const groupForm = {
        referenceId: group.referenceId,
    }

    /*Put the reference ids in the group*/
    groupForm.referenceId.push(referenceIds);

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

export const handleDelete = async (groupId: string, references: CSLBibInterface[], router: AppRouterInstance) => {
  for (let i = 0; i < references.length; i++){
    deleteGroupIdFromReference(groupId, references[i]);
  }
  
  try {
    await fetch(`/api/groups/${groupId}`, {
      method: "Delete",
    });
    router.push('/group-center');
    router.refresh();
  } catch (error) {
  }
};

export async function deleteGroupIdFromReference(groupId: string, reference: CSLBibInterface) {
  /*Create the form*/  
  const referenceForm = {
    groupId: reference.groupId,
  };

  /*Find the index of the selected group*/
  const index = referenceForm.groupId.indexOf(groupId);
  /*Splice the index and only remove 1 item*/
  referenceForm.groupId.splice(index, 1);

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

export async function deleteReferenceIdFromGroup(referenceId: string, group: Group) {
  /*Create the form*/
  const groupForm = {
    referenceId: group.referenceId,
};

  /*Find the index of the selected group*/
  const index = groupForm.referenceId.indexOf(referenceId);
  /*Splice the index and only remove 1 item*/
  groupForm.referenceId.splice(index, 1);

  /*Send the new data to the API to be modified*/
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
    console.log("Group not modified!");
  } 
}