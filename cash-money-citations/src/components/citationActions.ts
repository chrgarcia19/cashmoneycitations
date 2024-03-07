'use server'

const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
import dbConnect from "@/utils/dbConnect";
import Reference from "@/models/Reference";
import CSLBibModel from "@/models/CSLBibTex";
import { resolve } from "path";
require('@citation-js/plugin-bibtex')
const { plugins } = require('@citation-js/core')


const contentType = "application/json"

// Takes reference data & converts to CSL-JSON
function toCslJson(bibtexReference: any) {
    const cslJson = Cite.input(bibtexReference);
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
        await CSLBibModel.findByIdAndUpdate(_id, { citekey: newCiteKey })
    } catch(error) {
        console.error(error)
    }
}

async function InitializeCslJson(_id: string, cslJson: object) {
    try {
        await CSLBibModel.findByIdAndUpdate(_id, { cslJson: cslJson })
    } catch(error) {
        console.error(error)
    }
}

async function HandleInitialFormat(bibResponse: any) {

    // Used for configuring format for BibTex & BibLaTex
    const config = plugins.config.get('@bibtex')
    //config.parse.sentenceCase = 'always';
    // plugins.input.forceType = "@else/list+object"
    // config.types.bibtex.target['conference'] = 'conference'
    config.parse.strict = true

    //console.log(config.constants.required)
    // Converts our mimic CSLBib-JSON schema thing to BibLaTex
    const toBibTex = new Cite(JSON.stringify(bibResponse))

    const bibtexOutput = toBibTex.format('biblatex', {
        format: 'text',
        template: 'biblatex',
        lang: 'en-US'
    });

    // Converts the BibTex to CSL-JSON
    const cslJson = await toCslJson(bibtexOutput)

    // Adds the CSL-JSON to the existing database collection
    InitializeCslJson(bibResponse.id, cslJson);
}

export async function HandleInitialReference(form: any) {

    await dbConnect();
    // Create reference entry
    try {

        const bibResponse = await CSLBibModel.create(form)

        const bibJsonData = {
            id: bibResponse._id,
            citekey: bibResponse.citekey,
            type: bibResponse.entryType,
            title: bibResponse.title,
            author: bibResponse.contributors.map((contributor: { contributorFirstName: any; contributorLastName: any; }) => ({
            family: contributor.contributorLastName,
            given: contributor.contributorFirstName,
            })),
            issued: { "date-parts": [[parseInt(bibResponse.year, 10), bibResponse.month ? parseInt(bibResponse.month, 10) : 0]] },
            publisher: bibResponse.publisher,
            DOI: bibResponse.doi,
            URL: bibResponse.url,
            ISBN: bibResponse.isbn
        };

        // const {_id, contributors, year} = bibResponse
        // const contributorLastName = contributors[0].contributorLastName;
        // await InitializeCiteKey(_id, contributorLastName, year)

        await HandleInitialFormat(bibJsonData)

      } catch (error) {
        console.error(error)
      }


}