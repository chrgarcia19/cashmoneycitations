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


export async function CreateCitation(referenceId: any, styleChoice: any) {

    await dbConnect();
    
    let tempCslJson = await CSLBibModel.findById(referenceId)
    const cslJson = tempCslJson.cslJson

    // Create a Cite instance
    const citation = new Cite(cslJson);

    let templateName = styleChoice

    // Retrieve CSL Style from database

    const styleData = await CSLStyleModel.findOne({
        name: templateName,
    }).exec()
    // Retrieve CSL Style from root server
    // const stylePath = path.resolve(`./csl_styles/${templateName}`)
    // const styleData = fs.readFileSync(stylePath, 'utf8');

        
    const config = plugins.config.get('@csl')

    config.templates.add(templateName, styleData?.cslData)
    
    const customCitation = citation.format('bibliography', {
        format: 'text',
        template: templateName,
        lang: 'en-us'
    });

    const vanOutput = citation.format('bibliography', {
        format: 'text',
        template: 'vancouver',
        lang: 'en-US'
    });
    //Generate apa citation
    const apaOutput = citation.format('bibliography', {
        format: 'text',
        template: 'apa',
        lang: 'en-US'
    });
    const bibtexOutput = citation.format('biblatex', {
        format: 'text',
        template: 'bibtex',
        lang: 'en-US'
    });

    // Implement the logic to display or prepare the citation for download
    const citationData = JSON.stringify({ van: vanOutput, apa: apaOutput, bibtex: customCitation });
    return citationData;
}