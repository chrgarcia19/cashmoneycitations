'use server'

import mongoose from "mongoose";
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

export async function DeleteCitation(citationId: string) {
    await CitationModel.findOneAndDelete({ _id: citationId });
}

export async function GetRefCSLJson(referenceId: string, styleChoice: string, localeChoice: string) {
    let reference = await CSLBibModel.findOne({_id: referenceId});

    if (!reference) {
        throw new Error(`No reference found with ID ${referenceId}`);
    }
    reference = reference.toObject(); // Convert to plain JavaScript object

    let referenceCslJson = await CSLBibModel.findById(referenceId)
    const cslJson = referenceCslJson.cslJson
    cslJson[0].refId = reference._id
    return cslJson;

    // // Create a Cite instance with the references' cslJson data
    // const citation = new Cite(allCitations);

    // // Create a custom template and style for each specified style/locale
    // const templateName = styleChoice;
    // const localeName = localeChoice;

    // // Find citation style where the name = the selected list
    // const styleData = await CSLStyleModel.findOne({
    //     name: templateName,
    // }).exec()

    // // Find locale where name = inputted locale
    // const localeData = await CSLLocaleModel.findOne({
    //     name: localeName,
    // }).exec()

    // const config = plugins.config.get('@csl')
    
    // // Add citation style & locale to Citation.js config
    // config.templates.add(templateName, styleData?.cslData);
    // config.locales.add(localeName, localeData?.localeData);

    // // Create custom citation with user specified style & locale
    // const customCitation = citation.format('bibliography', {
    //     format: 'text',
    //     template: templateName,
    //     lang: localeName,
    // });

    // return customCitation;
}

export async function GetCSLStyle(templateName: string) {

    try {
        // Find citation style where the name = the selected list
        const styleData = await CSLStyleModel.findOne({
            name: templateName,
        }).exec()

        return styleData;
    } catch(e) {
        console.log(e)
    }


}

export async function GetCSLLocale(localeName: string) {

    try {
        // Find locale where name = inputted locale
        const localeData = await CSLLocaleModel.findOne({
            name: localeName,
        }).exec()

        return localeData;
    } catch(e) {
        console.log(e)
    }

}