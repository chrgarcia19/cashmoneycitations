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
export async function toCslJson(ReferenceData: any) {
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
                middle: result[0].author[i].middle,
                suffix: result[0].author[i].suffix
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
        contributors: contributors,
    };

    // Dynamically processes each date field to CSL standards
    function processDateField(result: any[], field: string) {
        if (result[0][field]) {
            let formatParts = format(result[0][field])
            let parts = formatParts.split("-");
    
            // Capitalizes first letter of field name and assigns it

            // Parse month to integer to remove leading zero, then convert back to string
            let year = parseInt(parts[0]).toString();
            CSLBibTexData["year" + field.charAt(0).toUpperCase() + field.slice(1)] = year;

            // Parse month to integer to remove leading zero, then convert back to string
            let month = parseInt(parts[1]).toString();
            CSLBibTexData["month" + field.charAt(0).toUpperCase() + field.slice(1)] = month;

            // Parse day to integer to remove leading zero, then convert back to string
            let day = parseInt(parts[2]).toString();
            CSLBibTexData["day" + field.charAt(0).toUpperCase() + field.slice(1)] = day;
        }
    }

    // Process each date field from incoming data
    processDateField(result, 'issued')
    processDateField(result, 'accessed')
    processDateField(result, 'available-date')
    processDateField(result, 'original-date')
    processDateField(result, 'event-date')
    processDateField(result, 'submitted')

    for (const key in result[0]) {
        if (typeMap[key as keyof typeof typeMap]) {
            CSLBibTexData[typeMap[key as keyof typeof typeMap]] = result[0][key];
        }
    }

    const mergedData = { ...result[0], ...CSLBibTexData };
    return mergedData
}

export async function CreateCslFromBibTex(bibData: string, userId: string | undefined) {
    try {
        await dbConnect();
        const input = bibData;
        const result = await toCslJson(input);
        if (result[0].id) {
            delete result[0].id;
        }
        const mergedData = await translateForeignModel(result)
        const CSLBibTexDocument = new CSLBibModel(mergedData);
        await CSLBibTexDocument.save();

        await AddRef2User(userId, CSLBibTexDocument._id);
        // Adds the CSL-JSON to the existing database collection
        InitializeCslJson(CSLBibTexDocument.id, result);

    } catch(error) {
        console.error(error)
    }
}

// Creates CSL-JSON for auto input -> DOI, ISBN, ISSN, etc.
export async function CreateCslJsonDocument(automaticInput: any, userId: string | undefined) {
    try {
        await dbConnect();
        const input = automaticInput
        const result = await toCslJson(input);

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

export async function InitializeCslJson(_id: string, cslJson: object) {
    try {
        await CSLBibModel.findByIdAndUpdate(_id, { cslJson: cslJson })
    } catch(error) {
        console.error(error)
    }
}

export async function HandleInitialFormat(bibResponse: any) {
    const cslParsedRef = Cite.plugins.input.chain(JSON.stringify(bibResponse), {
        target: '@else/json'
    })
    const cslJson = await toCslJson(cslParsedRef)
    await formatDate(cslJson[0])
    // Adds the CSL-JSON to the existing database collection
    InitializeCslJson(bibResponse.id, cslJson);
}

export async function formatDate(form: any) {
    // According to CSL-JSON Schema and BibLaTex standards the follow type map is used
    // BibLaTex ------ CSL-JSON
    // date(Published Date) ---------- issued
    // eventdate(Date of Event) ------ event-date
    // origdate(Date of OG Item) ----- original-date
    // urldate(Date when URL was accessed) ---- accessed
    if (form.yearPublished || form.monthPublished || form.dayPublished) {
        const datePublished = new Date(form.yearPublished, form.monthPublished, form.dayPublished);
        form.issued = parse(datePublished.toISOString().split('T')[0]);
    }

    if (form.yearAccessed || form.monthAccessed || form.dayAccessed) {
        const dateAccessed = new Date(form.yearAccessed, form.monthAccessed, form.dayAccessed);
        form.accessed = parse(dateAccessed.toISOString().split('T')[0]);
    }

    if (form.yearEvent || form.monthEvent || form.dayEvent) {
        const dateEvent = new Date(form.yearEvent, form.monthEvent, form.dayEvent);
        form["event-date"] = parse(dateEvent.toISOString().split('T')[0]);
    }

    if (form.yearAvailable || form.monthAvailable || form.dayAvailable) {
        const dateAvailable = new Date(form.yearAvailable, form.monthAvailable, form.dayAvailable);
        form["available-date"] = parse(dateAvailable.toISOString().split('T')[0]);
    }

    if (form.yearOriginal || form.monthOriginal || form.dayOriginal) {
        const dateOriginal = new Date(form.yearOriginal, form.monthOriginal, form.dayOriginal);
        form["original-date"] = parse(dateOriginal.toISOString().split('T')[0]);
    }

    if (form.yearSubmitted || form.monthSubmitted || form.daySubmitted) {
        const dateSubmitted = new Date(form.yearSubmitted, form.monthSubmitted, form.daySubmitted);
        form.submitted = parse(dateSubmitted.toISOString().split('T')[0]);
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

export async function HandleContributors(form: any) {
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
    form.chair = filterAndMapContributors(form, 'Chair');
    form["collection-editor"] = filterAndMapContributors(form, 'Collection Editor');
    form.compiler = filterAndMapContributors(form, 'Compiler');
    form.composer = filterAndMapContributors(form, 'Composer');
    form["container-author"] = filterAndMapContributors(form, 'Container Author');
    form.contributor = filterAndMapContributors(form, 'Contributor');
    form.curator = filterAndMapContributors(form, 'Curator');
    form.director = filterAndMapContributors(form, 'Director');
    form["editorial-director"] = filterAndMapContributors(form, 'Editorial Director');
    form["editor-translator"] = filterAndMapContributors(form, 'Editor Translator');
    form["executive-producer"] = filterAndMapContributors(form, 'Executive Producer');
    form.guest = filterAndMapContributors(form, 'Guest');
    form.host = filterAndMapContributors(form, 'Host');
    form.illustrator = filterAndMapContributors(form, 'Illustrator');
    form.interviewer = filterAndMapContributors(form, 'Interviewer');
    form.narrator = filterAndMapContributors(form, 'Narrator');
    form.organizer = filterAndMapContributors(form, 'Organizer');
    form["original-author"] = filterAndMapContributors(form, 'Original Author');
    form.performer = filterAndMapContributors(form, 'Performer');
    form.producer = filterAndMapContributors(form, 'Producer');
    form.recipient = filterAndMapContributors(form, 'Recipient');
    form["reviewed-author"] = filterAndMapContributors(form, 'Reviewed Author');
    form["script-writer"] = filterAndMapContributors(form, 'Script Writer');
    form["series-creator"] = filterAndMapContributors(form, 'Series Creator');
    form.translator = filterAndMapContributors(form, 'Translator');
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

        const cslJson = {
            id: bibResponse._id,
            type: bibResponse.type,
            title: bibResponse.title,
            "container-title": bibResponse["container-title"],
            "collection-title": bibResponse["collection-title"],
            // Date fields
            issued: form.issued,
            accessed: form.accessed,
            "event-date": form["event-date"],
            "available-date": form["available-date"],
            "original-date": form["original-date"],
            submitted: form.submitted,
            // End date fields
            // Contributor fields
            author: bibResponse.author,
            editor: bibResponse.editor,
            translator: bibResponse.translator,
            compiler: bibResponse.compiler,
            // End contributor fields
            publisher: bibResponse.publisher,
            DOI: bibResponse.doi,
            URL: bibResponse.url,
            ISBN: bibResponse.isbn,
            annote: bibResponse.annote,
            chapter: bibResponse.chapter,
            edition: bibResponse.edition,
            note: bibResponse.note,
            number: bibResponse.number,
            series: bibResponse.series,
            volumes: bibResponse.volumes,
            volume: bibResponse.volume,
            abstract: bibResponse.abstract,
            archive: bibResponse.archive,
            archive_collection: bibResponse.archive_collection,
            archive_location: bibResponse.archive_location,
            authority: bibResponse.authority,
            "call-number": bibResponse["call-number"],
            "citation-key": bibResponse["citation-key"],
            "citation-label": bibResponse["citation-label"],
            dimensions: bibResponse.dimensions,
            division: bibResponse.division,
            genre: bibResponse.genre,
            jurisdiction: bibResponse.jurisdiction,
            keyword: bibResponse.keyword,
            language: bibResponse.language,
            license: bibResponse.license,
            medium: bibResponse.medium,
            "original-publisher": bibResponse["original-publisher"],
            "original-title": bibResponse["original-title"],
            "part-title": bibResponse["part-title"],
            PMCID: bibResponse.PMCID,
            PMID: bibResponse.PMID,
            references: bibResponse.references,
            "reviewed-genre": bibResponse["reviewed-genre"],
            "reviewed-title": bibResponse["reviewed-title"],
            scale: bibResponse.scale,
            source: bibResponse.source,
            status: bibResponse.status,
            "volume-title": bibResponse["volume-title"],
            "year-suffix": bibResponse["year-suffix"],
            "chapter-number": bibResponse["chapter-number"],
            "citation-number": bibResponse["citation-number"],
            "collection-number": bibResponse["collection-number"],
            "first-reference-note-number": bibResponse["first-reference-note-number"],
            issue: bibResponse.issue,
            locator: bibResponse.locator,
            "page-first": bibResponse["page-first"],
            page: bibResponse.page,
            "number-of-pages": bibResponse["number-of-pages"],
            "part-number": bibResponse["part-number"],
            "printing-number": bibResponse["printing-number"],
            "supplement-number": bibResponse["supplement-number"],
            version: bibResponse.version,
            "number-of-volumes": bibResponse["number-of-volumes"],
            section: bibResponse.section,
            organization: bibResponse.organizer,
            running_time: bibResponse.running_time,
            format: bibResponse.format,
            image_url: bibResponse.image_url,
            api_source: bibResponse.api_source,
        }

        // Add DB id to form
        form.id = bibResponse._id;

        await HandleInitialFormat(cslJson);

      } catch (error) {
        console.error(error)
      }


}