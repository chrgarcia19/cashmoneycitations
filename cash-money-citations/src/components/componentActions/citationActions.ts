'use server'

const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
let { parse, format } = require('@citation-js/date')
import dbConnect from "@/utils/dbConnect";
import CSLBibModel, { CSLGeneralFields } from "@/models/CSLBibTex";
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
    'container-title': "container_title"
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
        given: "",
        family: "",
        middle: "",
        suffix: ""
    };
    let contributors = new Array<Contributor>();

    // If item.author is populated, move forward on that, otherwise, handle the error appropriately
    if (result[0].author) {
        for (i; i<result[0].author.length; i++) {
            newContributor = {
                role: "Author",
                given: result[0].author[i].given,
                family: result[0].author[i].family,
                middle: "",
                suffix: ""
            };
            contributors.push(newContributor);
        }
    }
    else {
        newContributor = {
            role: "Author",
            given: "Unknown",
            family: "Unknown",
            middle: "",
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

    //const toBibTex = new Cite(JSON.stringify(bibResponse))
    // const bibtexOutput = toBibTex.format('biblatex', {
    //     format: 'text',
    //     template: 'biblatex',
    //     lang: 'en-US'
    // });

    const test = Cite.plugins.input.chain(JSON.stringify(bibResponse), {
        target: '@else/json'
    })
    const { plugins } = require('@citation-js/core')
    const config = plugins.config.get('@bibtex')

    //console.log(config.constants.fieldTypes)
    const toBibTex = new Cite(test)
     const bibtexOutput = toBibTex.get({
        format: 'real',
        type: 'string',
        style: 'bibtex'
     })
    // Converts the BibTex to CSL-JSON
    const cslJson = await toCslJson(test)
    // Adds the CSL-JSON to the existing database collection
    InitializeCslJson(bibResponse.id, cslJson);
}

async function formatDate(form: any) {
    // According to CSL-JSON Schema and BibLaTex standards the follow type map is used
    // BibLaTex ------ CSL-JSON
    // date(Published Date) ---------- issued
    // eventdate(Date of Event) ------ event-date
    // origdate(Date of OG Item) ----- original-date
    // urldate(Date when URL was accessed) ---- accessed
    if (form.yearPublished || form.monthPublished || form.dayPublished) {
        const datePublished = new Date(form.yearPublished, form.monthPublished, form.dayPublished);
        form.datePublished = datePublished;
    }

    if (form.yearAccessed || form.monthAccessed || form.dayAccessed) {
        const dateAccessed = new Date(form.yearAccessed, form.monthAccessed, form.dayAccessed);
        form.dateAccessed = dateAccessed.toISOString().split('T')[0];
    }

    if (form.yearEvent || form.monthEvent || form.dayEvent) {
        const dateEvent = new Date(form.yearEvent, form.monthEvent, form.dayEvent);
        form.dateEvent = dateEvent.toISOString().split('T')[0];
    }
}

async function formatLocation(form: any) {
    if (form.archivePlaceCity || form.archivePlaceCountry) {
        form["archive-place"] = (form.archivePlaceCity + ", "+ form.archivePlaceCountry)
    }
    if (form.eventPlaceCity || form.eventPlaceCountry) {
        form["event-place"] = (form.eventPlaceCity + ", "+ form.eventPlaceCountry)
    }
    if (form.origPubPlaceCity || form.origPubPlaceCountry) {
        form["original-publisher-place"] = (form.origPubPlaceCity + ", "+ form.origPubPlaceCountry)
    }
    if (form.publisherPlaceCity || form.publisherPlaceCountry) {
        form["publisher-place"] = (form.publisherPlaceCity + ", "+ form.publisherPlaceCountry)
    }
}

async function AddRef2User(userId: string | undefined, referenceId: string) {
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

// Interface for creating bibliographies/citations
export interface CSLInterface extends CSLGeneralFields {
    "archive-place": string;
    "event-place": string;
    "original-publisher-place": string;
    "publisher-place": string;
}

async function HandleContributors(form: any) {
    function filterAndMapContributors(form: any, role: string) {
        return form.contributors
        .filter((contributor: any) => contributor.role === role)
        .map((contributor: any) => ({
            family: contributor.family,
            middle: contributor.middle,
            given: contributor.given,
            suffix: contributor.suffix,
        }));
    }

    form.author = filterAndMapContributors(form, 'Author');
    form.editor = filterAndMapContributors(form, 'Editor');

}



export async function HandleManualReference(form: any, userId: any) {

    await dbConnect();
    // Create reference entry
    try {
        await formatDate(form);
        await formatLocation(form);
        
        // Sorts through the contributor array of objects and assigns them properly
        await HandleContributors(form);
        const bibResponse = await CSLBibModel.create(form);
        await AddRef2User(userId, bibResponse._id);
        console.log(bibResponse)

        const formattedCslJson = {
            ...bibResponse,

        }
        const cslJsonData = {
            id: bibResponse._id,
            type: bibResponse.type,
            title: bibResponse.title,
            abstract: "",
            annote: bibResponse.annote,
            archive: "",
            author: bibResponse.contributors
                .filter((contributor: any) => contributor.role === 'Author')
                .map((contributor: any) => ({
                family: contributor.family,
                middle: contributor.middle,
                given: contributor.given,
                suffix: contributor.suffix
            })),
            editor: bibResponse.contributors
                .filter((contributor: any) => contributor.role === 'Editor')
                .map((contributor: any) => ({
                family: contributor.family,
                middle: contributor.middle,
                given: contributor.given,
                suffix: contributor.suffix
            })),
            translator: bibResponse.contributors
                .filter((contributor: any) => contributor.role === 'Translator')
                .map((contributor: any) => ({
                family: contributor.lastName,
                middle: contributor.middleName,
                given: contributor.firstName,
                suffix: contributor.suffix
            })),
            compiler: bibResponse.contributors
                .filter((contributor: any) => contributor.role === 'Compiler')
                .map((contributor: any) => ({
                family: contributor.family,
                middle: contributor.middle,
                given: contributor.given,
                suffix: contributor.suffix
            })), 
            issued: parse(bibResponse.datePublished?.toISOString().split('T')[0]),
            accessed: parse(bibResponse.dateAccessed?.toISOString().split('T')[0]),
            eventDate: parse(bibResponse["event-date"]),
            availableDate: parse(bibResponse["available-date"]),
            publisher: bibResponse.publisher,
            "container-title": bibResponse["container-title"], // container-title is the title of the Journal (if journal article) or Book (if book chapter)
            DOI: bibResponse.DOI,
            URL: bibResponse.URL,
            ISBN: bibResponse.ISBN,
            ISSN: bibResponse.ISSN,
            "archive-place": bibResponse["archive-place"],
            "event-place": bibResponse["event-place"],
            "original-publisher-place": bibResponse["original-publisher-place"],
            "publisher-place": bibResponse["publisher-place"],
            chapter: bibResponse.chapter,
            edition: bibResponse.edition,
            note: bibResponse.note,
            number: bibResponse.number,
            "number-of-pages": bibResponse["number-of-pages"],
            series: bibResponse.series,
            volumes: bibResponse.volumes,
            volume: bibResponse.volume,
            issue: bibResponse.issue,
            running_time: bibResponse.running_time,
            format: bibResponse.format,
            image_url: bibResponse.image_url,
            api_source: bibResponse.api_source,
        };

        console.log(cslJsonData)
        await HandleInitialFormat(bibResponse);

      } catch (error) {
        console.error(error)
      }


}