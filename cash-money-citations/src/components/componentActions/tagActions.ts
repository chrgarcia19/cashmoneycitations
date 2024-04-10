'use server'

import Tag from "@/models/Tag";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";

export async function getTags() {
    await dbConnect();
  
    const result = await Tag.find({});
    const tags = result.map((doc) => {
      const tag = JSON.parse(JSON.stringify(doc));
      return tag;
    });
  
    return tags;
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

export async function getSpecificTagById(id: string | string[] | undefined) {
  try {
    let result = await Tag.findById(id);

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

export async function getUserTags(userId: string) {
    await dbConnect();
  
    try {
      // Retrieve list of users tags
      const userOwnedTags = await User.findById(userId).select('ownedTags');
  
      const result = await Tag.find({
        // Find tags where _id matches userOwnedTags
        _id: { $in: userOwnedTags.ownedTags }
      });
      const tags = result.map((doc) => {
        const tag = JSON.parse(JSON.stringify(doc));
        return tag;
      });
    
      return tags;
    } catch(e) {
      console.error(e);
    }
  }

  async function addTagToUser(userId: string | undefined, tagId: string){
    await dbConnect();

    try {
      const user = await User.findById(userId);
      if (user) {
        user.ownedTags = [...user.ownedTags, tagId];
        await user.save();
      }
    } catch (e) {
      console.error(e);
    }
  } 

  export async function handleNewTag(form: any, userId: any) {
    await dbConnect();

    try {
      const tagResponse = await Tag.create(form);

      await addTagToUser(userId, tagResponse._id);
    } catch (e){
      console.error(e);
    }
  }

  export async function editTag(form: any, id: any){
    await dbConnect();

    try {
      await Tag.findByIdAndUpdate(id, form, {
        new: true,
        runValidators: true,});
    } catch (e){
      console.error(e);
    }
  }