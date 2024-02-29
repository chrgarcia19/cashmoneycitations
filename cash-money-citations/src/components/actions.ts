'use server';

import dbConnect from "@/utils/dbConnect";
import Reference from "@/models/Reference";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import { revalidatePath } from "next/cache";
import { Router } from "next/router";
import { error } from "console";

interface RegistrationData {
  username: string;
  firstName: string;
  lastName: string; 
  email: string;
  password: string;
}

export async function getReferences() {
    await dbConnect();
  
    const result = await Reference.find({});
    const references = result.map((doc) => {
      const reference = JSON.parse(JSON.stringify(doc));
      return reference;
    });
  
    return references;
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
      
      revalidatePath('/');
  } catch (error) {
    return {
      status: 409,
      message: "Unknown user creation error. Please try again."
    };
  }
}