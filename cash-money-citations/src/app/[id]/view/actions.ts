'use server'

import path from "path";

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

export async function CreateCitation(referenceId: any, styleChoice: Array<string>) {

    await dbConnect();
    
    let referenceCslJson = await CSLBibModel.findById(referenceId)
    const cslJson = referenceCslJson.cslJson
    const referenceTitle = referenceCslJson.title

    // Create a Cite instance
    const citation = new Cite(cslJson);

    // Retrieve CSL Style from database
    for (const style in styleChoice) {
        const templateName = styleChoice[style]

        const styleData = await CSLStyleModel.findOne({
            name: templateName,
        }).exec()
            
        const config = plugins.config.get('@csl')
        
        config.templates.add(templateName, styleData?.cslData)
        
        const customCitation = citation.format('bibliography', {
            format: 'text',
            template: templateName,
            lang: 'en-us'
        });

        const newCustomCitation = await CitationModel.create({
            name: templateName + referenceTitle,
            CitationData: customCitation
        });

        const citationIdList = referenceCslJson.citationIdList || [];
        citationIdList.push(newCustomCitation.id);
        await CSLBibModel.findByIdAndUpdate(referenceId, {
            citationIdList: citationIdList
        });

    }

}