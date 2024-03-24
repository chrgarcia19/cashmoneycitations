'use server'

const fs = require('fs');
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
const { plugins } = require('@citation-js/core')
import CSLBibModel from "@/models/CSLBibTex";
import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";
import CSLLocaleModel from "@/models/CSLLocale";
import CitationModel from "@/models/Citation";



export async function CreateCitation(referenceId: any, styleChoice: string, localeChoice: string) {

    await dbConnect();
    
    let referenceCslJson = await CSLBibModel.findById(referenceId)
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

    const newCustomCitation = await CitationModel.create({
        name: templateName + referenceTitle,
        style: templateName,
        CitationData: customCitation,
        language: localeName,
    });

    // Create/Update citation ID list
    const citationIdList = referenceCslJson.citationIdList || [];
    citationIdList.push(newCustomCitation.id);
    await CSLBibModel.findByIdAndUpdate(referenceId, {
        citationIdList: citationIdList
    });


    

}