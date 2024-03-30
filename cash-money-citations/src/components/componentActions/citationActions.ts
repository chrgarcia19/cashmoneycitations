'use server'

const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
let { parse, format } = require('@citation-js/date')
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
     console.log(cslJson)
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

    if (form.year_published || form.month_published || form.day_published) {
        const datePublished = new Date(form.year_published, form.month_published, form.day_published);
        form.date = datePublished.toISOString().split('T')[0];
    }

    if (form.year_accessed || form.month_accessed || form.day_accessed) {
        const dateAccessed = new Date(form.year_accessed, form.month_accessed, form.day_accessed);
        form.urldate = dateAccessed.toISOString().split('T')[0];
    }

    if (form.year_event || form.month_event || form.day_event) {
        const dateEvent = new Date(form.year_event, form.month_event, form.day_event);
        form.eventdate = dateEvent.toISOString().split('T')[0];
    }
}

async function formatLocation(form: any) {
    form.address = (form.city + ", "+ form.state)
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

function userInputToBibLaTex(userInput: any) {
    let bibLaTex = `@${userInput.type}{${userInput.id},\n`;

    for (let key in userInput) {
        if (key !== 'type' && key !== 'id') {
            bibLaTex += `  ${key} = {${userInput[key]}},\n`;
        }
    }

    bibLaTex += '}\n';

    return bibLaTex;
}

export async function HandleManualReference(form: any, userId: any) {
    const userInput = {
        type: 'book',
        id: '123',
        author: 'Doe, John Sr',
        title: 'Some Book',
        publisher: 'Some Publisher',
        eventdate: '1, 5, 2014',
        origdate: '2000-5-1',
        date: "1943-11-3",
        year: '2022'
    };
    await dbConnect();
    // Create reference entry
    try {
        await formatDate(form);
        await formatLocation(form);
        const bibTest = await userInputToBibLaTex(userInput);
        console.log(bibTest)
        const cslJson = await toCslJson(bibTest)
        console.log(cslJson[0])
        const bibResponse = await CSLBibModel.create(form)
        await AddRef2User(userId, bibResponse._id);

        interface CSL {
            abstract: string;
            annote: string;
            archive: string;
            archive_collection: string;
            archive_location: string;
            "archive-place": string;
            authority: string;
            "call-number": string;
            "citation-key": string;
            "citation-label": string;
            "collection-title": string;
            "container-title": string;
            dimensions: string;
            division: string;
            DOI: string;
            event: string;
            "event-title": string;
            "event-place": string;
            genre: string;
            ISBN: string;
            ISSN: string;
            jurisdiction: string;
            keyword: string;
            language: string;
            license: string;
            medium: string;
            note: string;
            "original-publisher": string;
            "original-publisher-place": string;
            "original-title": string;
            "part-title": string;
            PMCID: string;
            PMID: string;
            publisher: string;
            "publisher-place": string;
            references: string;
            "reviewed-genre": string;
            "reviewed-title": string;
            scale: string;
            source: string;
            status: string;
            title: string;
            URL: string;
            "volume-title": string;
            "year-suffix": string;
            "chapter-number": string;
            "citation-number": string;
            "collection-number": string;
            edition: string;
            "first-reference-note-number": string;
            issue: string;
            locator: string;
            number: string;
            "number-of-pages": string;
            "number-of-volumes": string;
            page: string;
            "page-first": string;
            "part-number": string;
            "printing-number": string;
            section: string;
            "supplement-number": string;
            version: string;
            volume: string;

            // Date variables ***************
            accessed: string;
            "available-date": string;
            "event-date": string;
            issued: string;
            "original-date": string;
            submitted: string;

            // Contributor variables *********
            author: string;
            chair: string;
            "collection-editor": string;
            compiler: string;
            composer: string;
            "container-author": string;
            contributor: string;
            curator: string;
            director: string;
            editor: string;
            "editorial-director": string;
            "editor-translator": string;
            "executive-producer": string;
            guest: string;
            host: string;
            illustrator: string;
            interviewer: string;
            narrator: string;
            organizer: string;
            "original-author": string;
            performer: string;
            producer: string;
            recipient: string;
            "reviewed-author": string;
            "script-writer": string;
            "series-creator": string;
            translator: string;
        }

        const bibJsonData = {
            id: bibResponse._id,
            type: bibResponse.type,
            title: bibResponse.title,
            abstract: "",
            annote: bibResponse.annote,
            archive: "",
            author: bibResponse.contributors.map((contributor: { role: any; firstName: any; lastName: any; }) => ({
            family: contributor.lastName,
            given: contributor.firstName,
            })),
            issued: parse(bibResponse.date),
            accessed: parse(bibResponse.urldate),
            eventdate: parse(bibResponse.eventdate),
            availableDate: parse(bibResponse.date),
            publisher: bibResponse.publisher,
            "container-title": "New York Times", // container-title is the title of the Journal (if journal article) or Book (if book chapter)
            DOI: bibResponse.doi,
            URL: bibResponse.url,
            ISBN: bibResponse.isbn,
            location: bibResponse.location,
            contributors: bibResponse.contributors,
            indextitle: bibResponse.indextitle,
            chapter: bibResponse.chapter,
            edition: bibResponse.edition,
            editor: bibResponse.editor,
            howpublished: bibResponse.howpublished,
            institution: bibResponse.institution,
            note: bibResponse.note,
            number: bibResponse.number,
            organization: bibResponse.organization,
            pages: bibResponse.pages,
            school: bibResponse.school,
            series: bibResponse.series,
            volumes: bibResponse.volumes,
            short_title: bibResponse.short_title,
            volume: bibResponse.volume,
            doi: bibResponse.doi,
            issn: bibResponse.issn,
            isbn: bibResponse.isbn,
            url: bibResponse.url,
            running_time: bibResponse.running_time,
            format: bibResponse.format,
            image_url: bibResponse.image_url,
            issue: bibResponse.issue,
            api_source: bibResponse.api_source,
        };

        await HandleInitialFormat(bibJsonData);

      } catch (error) {
        console.error(error)
      }


}