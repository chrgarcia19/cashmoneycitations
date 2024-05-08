'use server';

import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import { revalidatePath } from "next/cache";
import CSLBibModel from "@/models/CSLBibTex";
import UserStyleList from '@/models/UserStyleList'; 
import mongoose from "mongoose";
import { LogCMCError } from "./logActions";

interface RegistrationData {
  username: string;
  firstName: string;
  lastName: string; 
  email: string;
  password: string;
}

export async function getReferences() {
    await dbConnect();

    try {
      const result = await CSLBibModel.find({});
      const references = result.map((doc) => {
        const reference = JSON.parse(JSON.stringify(doc));
        return reference;
      });
    
      return references;
    } catch(e: any) {
      LogCMCError("CRITICAL", "DATABASE", e);
      console.error(e);
      return [];
    }
}

export async function getUserReferences(userId: string) {
  await dbConnect();

  try {
    // Retrieve list of users references
    const userOwnedRefs = await User.findById(userId).select('ownedReferences');

    const result = await CSLBibModel.find({
      // Find references where _id matches userOwnedRefs
      _id: { $in: userOwnedRefs.ownedReferences }
    });
    const references = result.map((doc) => {
      const reference = JSON.parse(JSON.stringify(doc));
      return reference;
    });
  
    return references;
  } catch(e: any) {
    LogCMCError("INFORMATION", "DATABASE", e);
    console.error(e);
  }


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

export async function getSpecificReferenceById(id: string | string[] | undefined) {
  try {
    let result = await CSLBibModel.findById(id);

    result = toObjectRecursive(result);

    if (result) {
      return result;
    } else {
      return false;
    }
  } catch(e: any) {
    LogCMCError("WARNING", "DATABASE", e);
    console.error(e);
  }
}

export async function getSpecificUserById(id: string | string[] | undefined) {
  try {
    let result = await User.findById(id);

    result = toObjectRecursive(result);

    if (result) {
      return result;
    } else {
      return false;
    }
  } catch(e: any) {
    LogCMCError("WARNING", "DATABASE", e);
    console.error(e)
  }
}

export async function initializeUserStyleList(userId: string) {
  try {
    // Create a new UserStyleList document that references the user
    const userStyleList = new UserStyleList({
      userId: userId,
      styleList: [],
      defaultStyles: [
          "Modern Language Association 7th edition",
          "Modern Language Association 8th edition",
          "Modern Language Association 9th edition",
          "American Psychological Association 7th edition",
          "Chicago Manual of Style 17th edition (author-date)",
          "Chicago Manual of Style 17th edition (full note)",
          "Chicago Manual of Style 17th edition (note)",
          "ACM SIGGRAPH",
          "IEEE",
      ]
    });
    await userStyleList.save();

  } catch(e: any) {
    LogCMCError("WARNING", "DATABASE", e);
    console.error(e);
  }
}

export async function createUser(form: RegistrationData) {
  await dbConnect();
  try {
      
      const req = await form;

      const { username, firstName, lastName, email, password } = req;

 
      const userExists = await User.findOne({email});

      if (userExists) {
        return {
          exists: true,
          status: 409,
          message: "Email already in use."
        };
      }
      
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);


      // Create a new user
      const user = new User({
          username,
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: 'user',
          accounts: [{ provider: "credential" }],
      });

      // Save the user to the database
      await user.save();
      await initializeUserStyleList(user._id);

      
      revalidatePath('/');
  } catch (e: any) {
    LogCMCError("WARNING", "DATABASE", e);

    return {
      status: 409,
      message: "Unknown user creation error. Please try again."
    };
  }
}