'use server'

const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex";
import { Contributor } from "@/models/Contributor";
require('@citation-js/plugin-bibtex')
const { plugins } = require('@citation-js/core')

const contentType = "application/json"

// Type map for foreign fields -> native fields. Format [FOREIGN_FIELD: NATIVE_FIELD]
const typeMap: {[key: string]: string } = {
    'DOI': 'doi',
    'ISBN': 'isbn',
    'ISSN': 'issn',
    'issn-type': 'issnType',
    'page': 'pages',
    'source': 'apiSource',
    'journal-title': 'journalTitle',
    'first-page': 'firstPage',
    'doi-asserted-by': 'doiAssertedBy',
    'key': 'referenceId',
    'reference': 'referencesUsed',
    'URL': 'url',
  }
  
// Takes reference data & converts to CSL-JSON
function toCslJson(ReferenceData: any) {
    const cslJson = Cite.input(ReferenceData);
    return cslJson;
}

// Uses type mapping to translate foreign fields to our reference fields
function translateForeignModel(result: any) {
    let i = 0;
    let newContributor: Contributor = {
        contributorType: "",
        contributorFirstName: "",
        contributorLastName: "",
        contributorMiddleI: ""
    };
    let contributors = new Array<Contributor>();

    //If item.author is populated, move forward on that, otherwise, handle the error appropriately
    if (result[0].author) {
        for (i; i<result[0].author.length; i++) {
            newContributor = {
                contributorType: "Author",
                contributorFirstName: result[0].author[i].given,
                contributorLastName: result[0].author[i].family,
                contributorMiddleI: ""
            };
            contributors.push(newContributor);
        }
    }
    else {
        newContributor = {
            contributorType: "Author",
            contributorFirstName: "Unknown",
            contributorLastName: "Unknown",
            contributorMiddleI: ""
        };
        contributors.push(newContributor);
    }


    const CSLBibTexData: { [key: string]: any } = {
        year: result[0].created['date-parts'][0][0],
        month: result[0].created['date-parts'][0][1],
        contributors: contributors,
    };

    for (const key in result[0]) {
        if (typeMap[key as keyof typeof typeMap]) {
            CSLBibTexData[typeMap[key as keyof typeof typeMap]] = result[0][key];
        }
    }

    const mergedData = { ...result[0], ...CSLBibTexData };

    return mergedData
}

// Creates CSL-JSON for auto input -> DOI, ISBN, ISSN, etc.
export async function CreateCslJsonDocument(automaticInput: any) {
    try {
        await dbConnect();
        const input = automaticInput
        const result = toCslJson(input);

        const mergedData = translateForeignModel(result);

        //console.log(mergedData)

        const CSLBibTexDocument = new CSLBibModel(mergedData);
        await CSLBibTexDocument.save()

        //await CSLBibModel.create(result);
    } catch(error) {
        console.error(error)
    }
}
// LAST WORKING ON GETTING DOI INPUT TO WORK CORRECTLY
// RECIEVING AN ERROR WHERE THE CITE.INPUT IS UNABLE TO CONVERT THE TITLE ARRAY TO A STRING.

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
    // config.parse.strict = true

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