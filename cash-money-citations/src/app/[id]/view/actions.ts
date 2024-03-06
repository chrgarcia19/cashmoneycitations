'use server'

import path from "path";

const fs = require('fs');
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
const { plugins } = require('@citation-js/core')
import CSLBibModel from "@/models/CSLBibTex";
import dbConnect from "@/utils/dbConnect";

export async function CreateCitation(reference: any, styleChoice: any) {

    await dbConnect();
    // let type = "";
        
    // if (reference.type === 'journal'){
    //     type = 'article-journal'
    // }
    // if (reference.type === 'website'){
    //     type = reference.type
    // }
    // if (reference.type === 'book'){
    //     type = reference.type
    // }
    // const cslData = {
    //     id: reference._id,
    //     type: type,
    //     title: reference.title,
    //     author: reference.contributors.map((contributor: { contributorFirstName: any; contributorLastName: any; }) => ({
    //     family: contributor.contributorFirstName,
    //     given: contributor.contributorLastName,
    //     })),
    //     issued: { "date-parts": [[parseInt(reference.year, 10), reference.month ? parseInt(reference.month, 10) : 0]] },
    //     publisher: reference.publisher,
    //     DOI: reference.doi,
    //     URL: reference.url,
    //     ISBN: reference.isbn
    // };
    
    // NEED TO CONVERT FROM USING THE REFERENCE MODEL TO THE NEW CSLBIBMODEL
    let tempCslJson = await CSLBibModel.findById("65e8d11a59e08b35e2ea8a1f")
    const cslJson = tempCslJson.cslJson

    // Create a Cite instance
    const citation = new Cite(cslJson);

    let templateName = styleChoice
    console.log(templateName)

    // Retrieve CSL Style from root server
    const stylePath = path.resolve(`./csl_styles/${templateName}`)
    const styleData = fs.readFileSync(stylePath, 'utf8');

        
    const config = plugins.config.get('@csl')

    config.templates.add(templateName, styleData)
    
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