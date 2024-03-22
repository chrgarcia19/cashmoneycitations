'use server'

const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex";
import { Contributor } from "@/models/Contributor";
import { RedirectType, redirect } from "next/navigation";
import User from "@/models/User";

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
    // Requires any of the following formats: DOI, Bib(La)Tex, WikiData, CSL|https://citation.js.org/api/0.3/tutorial-input_formats.html
    const cslJson = Cite.input(ReferenceData);
    return cslJson;
}

// Uses type mapping to translate foreign fields to our reference fields
function translateForeignModel(result: any) {
    let i = 0;
    let newContributor: Contributor = {
        role: "",
        firstName: "",
        lastName: "",
        middleName: "",
        suffix: ""
    };
    let contributors = new Array<Contributor>();

    // If item.author is populated, move forward on that, otherwise, handle the error appropriately
    if (result[0].author) {
        for (i; i<result[0].author.length; i++) {
            newContributor = {
                role: "Author",
                firstName: result[0].author[i].given,
                lastName: result[0].author[i].family,
                middleName: "",
                suffix: ""
            };
            contributors.push(newContributor);
        }
    }
    else {
        newContributor = {
            role: "Author",
            firstName: "Unknown",
            lastName: "Unknown",
            middleName: "",
            suffix: ""
        };
        contributors.push(newContributor);
    }


    const CSLBibTexData: { [key: string]: any } = {
        year: result[0].created['date-parts'][0][0],
        day: result[0].created['date-parts'][0][2],
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
export async function CreateCslJsonDocument(automaticInput: any, userId: string | undefined) {
    try {
        await dbConnect();
        const input = automaticInput
        const result = toCslJson(input);

        const mergedData = translateForeignModel(result);


        const CSLBibTexDocument = new CSLBibModel(mergedData);
        await CSLBibTexDocument.save()

        await AddRef2User(userId, CSLBibTexDocument._id);

        const toBibTex = new Cite(JSON.stringify(result))

        const bibtexOutput = toBibTex.format('biblatex', {
            format: 'text',
            template: 'biblatex',
            lang: 'en-US'
        });
    
        // Converts the BibTex to CSL-JSON
        const cslJson = await toCslJson(bibtexOutput)
        // Adds the CSL-JSON to the existing database collection
        InitializeCslJson(CSLBibTexDocument.id, cslJson);

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

async function formatDate(form: any) {
    let formattedDate = new Date(form.year_published, form.month_published, form.day_published);
    form.date = formattedDate;
}

async function formatLocation(form: any) {
    form.address = (form.city + ", "+ form.state)
}

async function AddRef2User(userId: string, referenceId: string) {
    await dbConnect();

    try {
        const user = await User.findById(userId);
        if (user) {
            user.ownedReferences = [...user.ownedReferences, referenceId];
            await user.save();
        }
    } catch(e) {
        console.error(e);
    }
}

export async function HandleManualReference(form: any, userId: any) {

    await dbConnect();
    // Create reference entry
    try {
        await formatDate(form);
        await formatLocation(form);

        const bibResponse = await CSLBibModel.create(form)

        await AddRef2User(userId, bibResponse._id);

        const bibJsonData = {
            id: bibResponse._id,
            type: bibResponse.type,
            title: bibResponse.title,
            author: bibResponse.contributors.map((contributor: { role: any; firstName: any; lastName: any; }) => ({
            family: contributor.lastName,
            given: contributor.firstName,
            })),
            date: bibResponse.date,
            publisher: bibResponse.publisher,
            DOI: bibResponse.doi,
            URL: bibResponse.url,
            ISBN: bibResponse.isbn
        };

        await HandleInitialFormat(bibJsonData);

      } catch (error) {
        console.error(error)
      }


}