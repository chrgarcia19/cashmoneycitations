'use server'

import Group from "@/models/Group";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";

export async function getGroups() {
    await dbConnect();
  
    const result = await Group.find({});
    const groups = result.map((doc) => {
      const group = JSON.parse(JSON.stringify(doc));
      return group;
    });
  
    return groups;
}


function toObjectRecursive(doc: any) {
  if (doc instanceof mongoose.Document || doc instanceof mongoose.Types.DocumentArray) {
    doc = doc.toObject({ getters: true, virtuals: true });
    for (let key in doc) {
      doc[key] = toObjectRecursive(doc[key]);
    }
  } else if (doc instanceof mongoose.Types.ObjectId) {
    doc = doc.toString();
  } else if (Array.isArray(doc)) {
    for (let i = 0; i < doc.length; i++) {
      doc[i] = toObjectRecursive(doc[i]);
    }
  } else if (typeof doc === 'object' && doc !== null) {
    for (let key in doc) {
      doc[key] = toObjectRecursive(doc[key]);
    }
  }
  return doc;
}

export async function getSpecificGroupById(id: string | string[] | undefined) {
  try {
    let result = await Group.findById(id);

    result = toObjectRecursive(result);

    if (result) {
      return result;
    } else {
      return false;
    }
  } catch(error) {
    console.error(error)
  }
}

export async function getUserGroups(userId: string) {
    await dbConnect();
  
    try {
      // Retrieve list of users groups
      const userOwnedGroups = await User.findById(userId).select('ownedGroups');
  
      const result = await Group.find({
        // Find groups where _id matches userOwnedGroups
        _id: { $in: userOwnedGroups.ownedGroups }
      });
      const groups = result.map((doc) => {
        const group = JSON.parse(JSON.stringify(doc));
        return group;
      });
    
      return groups;
    } catch(e) {
      console.error(e);
    }
  }

  async function addGroupToUser(userId: string | undefined, groupId: string){
    await dbConnect();

    try {
      const user = await User.findById(userId);
      if (user) {
        user.ownedGroups = [...user.ownedGroups, groupId];
        await user.save();
      }
    } catch (e) {
      console.error(e);
    }
  } 

  export async function handleNewGroup(form: any, userId: any) {
    await dbConnect();

    try {
      const groupResponse = await Group.create(form);

      await addGroupToUser(userId, groupResponse._id);
    } catch (e){
      console.error(e);
    }
  }

  export async function editGroup(form: any, id: any){
    await dbConnect();

    try {
      await Group.findByIdAndUpdate(id, form, {
        new: true,
        runValidators: true,});
    } catch (e){
      console.error(e);
    }
  }