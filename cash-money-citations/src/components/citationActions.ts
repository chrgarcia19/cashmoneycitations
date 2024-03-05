'use server'

const fs = require('fs');
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
const { plugins } = require('@citation-js/core')
import dbConnect from "@/utils/dbConnect";
import Reference from "@/models/Reference";

const contentType = "application/json"

// Takes reference data & converts to CSL-JSON
function toCslJson(reference: any) {
    const cslJson = Cite.input(reference);
    return JSON.stringify(cslJson);
}


export async function HandleInitialReference(form: FormData) {

    await dbConnect();
    // Create reference entry
    try {
        const res = await fetch("/api/references", {
          method: "POST",
          headers: {
            Accept: contentType,
            "Content-Type": contentType,
          },
          body: JSON.stringify(form),
        });
  
        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
          throw new Error(res.status.toString());
        }

      } catch (error) {
        console.error(error)
      }

    // Create CSL-JSON Entry
    try {
        const citation = await 
    } catch(error) {
        console.error(error)
    }
}