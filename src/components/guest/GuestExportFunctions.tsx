'use server'

const fs = require('fs');
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/plugin-bibjson')
require('@citation-js/core')
const { plugins } = require('@citation-js/core')
import CSLBibModel from "@/models/CSLBibTex";
import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";
import CSLLocaleModel from "@/models/CSLLocale";
import CitationModel from "@/models/Citation";
import UserStyleList from "@/models/UserStyleList";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function CreateCitation(referenceId: any, styleChoice: string, localeChoice: string) {

    await dbConnect();

    try {
        let allCitations = [];

        for (let id of referenceId) {
            let referenceCslJson = await CSLBibModel.findById(id)
            const cslJson = referenceCslJson.cslJson
            await SaveCitationsToDB(id, referenceCslJson, styleChoice, localeChoice);
            // Add the citation to allCitations
            allCitations.push(cslJson);
        }

        // Create a Cite instance with the references' cslJson data
        const citation = new Cite(allCitations);
    
        // Create a custom template and style for each specified style/locale
        const templateName = styleChoice;
        const localeName = localeChoice;
    
        // Find citation style where the name = the selected list
        const styleData = await CSLStyleModel.findOne({
            name: templateName,
        }).exec()
    
        // Find locale where name = inputted locale
        const localeData = await CSLLocaleModel.findOne({
            name: localeName,
        }).exec()
    
        const config = plugins.config.get('@csl')
        
        // Add citation style & locale to Citation.js config
        config.templates.add(templateName, styleData?.cslData);
        config.locales.add(localeName, localeData?.localeData);
    
        // Create custom citation with user specified style & locale
        const customCitation = citation.format('bibliography', {
            format: 'text',
            template: templateName,
            lang: localeName,
        });

        return customCitation;
    } catch(e) {
        console.error(e);
    }
}

async function SaveCitationsToDB(refId: string, referenceCslJson: any, styleChoice: string, localeChoice: string) {

        const cslJson = referenceCslJson.cslJson
        const referenceTitle = referenceCslJson.title

        // Create a Cite instance with the references' cslJson data
        const citation = new Cite(cslJson);
    
        // Create a custom template and style for each specified style/locale
        const templateName = styleChoice;
        const localeName = localeChoice;
    
        // Find citation style where the name = the selected list
        const styleData = await CSLStyleModel.findOne({
            name: templateName,
        }).exec()
    
        // Find locale where name = inputted locale
        const localeData = await CSLLocaleModel.findOne({
            name: localeName,
        }).exec()
    
        const config = plugins.config.get('@csl')
        
        // Add citation style & locale to Citation.js config
        config.templates.add(templateName, styleData?.cslData);
        config.locales.add(localeName, localeData?.localeData);
    
        // Create custom citation with user specified style & locale
        const customCitation = citation.format('bibliography', {
            format: 'text',
            template: templateName,
            lang: localeName,
        });
    
        let newCustomCitation = await CitationModel.create({
            name: templateName + referenceTitle,
            style: styleData.title,
            CitationData: customCitation,
            language: localeName,
        });
    
        // Create/Update citation ID list
        const citationIdList = referenceCslJson.citationIdList || [];
        citationIdList.push(newCustomCitation.id);
        await CSLBibModel.findByIdAndUpdate(refId, {
            citationIdList: citationIdList
        });
    
        newCustomCitation = newCustomCitation.toObject();
        newCustomCitation._id = newCustomCitation._id.toString();
        
    
}
export async function GetBibLaTexFile(reference: any, lang: string) {
    // Convert the reference to CSL JSON using Cite.input
    // Ensure that the reference is in a format compatible with Cite.input
    const cslJson = Cite.input(reference);

    // Create a new Cite instance with the CSL JSON data
    const citation = new Cite(cslJson);

    // Retrieve the locale data for the specified language
    // Assuming CSLLocaleModel is defined elsewhere to handle locale data retrieval
    const localeData = await CSLLocaleModel.findOne({
        name: lang,
    }).exec();

    // Configure the citation-js plugin to use the retrieved locale data
    const config = plugins.config.get('@csl');
    config.locales.add(lang, localeData?.localeData);

    // Format the citation using BibLaTeX with the specified locale
    const customCitation = citation.format('biblatex', {
        format: 'text',
        template: "biblatex",
        lang: lang,
    });

    return customCitation;
}

export async function GetBibTexFile(reference: any, lang: string) {
    // Ensure the reference includes necessary data in cslJson format
    const cslJson = Cite.input(reference);

    // Create a new Cite instance with the CSL JSON data
    const citation = new Cite(cslJson);

    // Create custom citation with user specified style & locale
    const customCitation = citation.format('bibtex', {
        format: 'text',
        template: "bibtex",
        lang: lang,
    });

    return customCitation;
}

export async function GetJSONFile(reference: any, lang: string) {
    // Assume that reference is already in a compatible format
    const cslJson = Cite.input(reference);

    // Create a new Cite instance with the CSL JSON data
    const citation = new Cite(cslJson);

    // Create custom citation with user specified style & locale
    const customCitation = citation.format('data', {
        format: 'object',
        template: "data",
        lang: lang,
    });

    // Return the first element of the citation array, assuming it's what's needed
    return customCitation[0];
}

export async function FilterCslStyleNames(styleName: string) {
    await dbConnect();

    const result = await CSLStyleModel.find({
        title: { $regex: new RegExp(styleName, "i") }
    },
    'title _id'
    ); // Only returning title from the CSL style
    const styles = result.map((doc) => {
        const style = JSON.parse(JSON.stringify(doc));
        return style;
    });

    return styles;
}