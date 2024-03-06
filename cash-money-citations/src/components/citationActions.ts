'use server'

const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
import dbConnect from "@/utils/dbConnect";
import Citation from "@/models/Citation";
import Reference from "@/models/Reference";
import BibTexModel from "@/models/BibTexModel";

const contentType = "application/json"

// Takes reference data & converts to CSL-JSON
function toCslJson(reference: any) {
    const cslJson = Cite.input(reference);
    // Last working on a way to validate CSL-JSON and save in Database
    // Last last working on ensuring that the input to cslJson will always return CSL no matter if it is manual input or DOI
    // We may need to alter the references model to fix this
    return cslJson;
}

// Creates citeKey based off of first author last name and year
async function InitializeCiteKey(_id: string, contributorLastName: string, year: Date) {
    try{
        const fullYear = year.getUTCFullYear();
        const newCiteKey = (contributorLastName + fullYear)
        await BibTexModel.findByIdAndUpdate(_id, { citeKey: newCiteKey })
    } catch(error) {
        console.error(error)
    }
}

export async function HandleInitialReference(form: any) {

    await dbConnect();
    // Create reference entry
    try {

        const res = await Reference.create(
            form
        )
        const bibResponse = await BibTexModel.create(
            form
        )
        const {_id, contributors, year} = bibResponse
        const contributorLastName = contributors[0].contributorLastName;
        InitializeCiteKey(_id, contributorLastName, year)

      } catch (error) {
        console.error(error)
      }

    // Create CSL-JSON Entry
    try {
        const cslJson = toCslJson(form)
        await Citation.create(
            cslJson
        )
    } catch(error) {
        console.error(error)
    }
}