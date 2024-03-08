'use server'
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
const { plugins } = require('@citation-js/core')
const fs = require('fs');
import path from 'path';

export default async function CiteDisplay(cslData: any, styleChoice: string) {

    let templateName = styleChoice

    // Retrieve CSL Style from root server
    const stylePath = path.resolve(`./csl_styles/${templateName}`)
    const styleData = fs.readFileSync(stylePath, 'utf8');

        
    const config = plugins.config.get('@csl')

    config.templates.add(templateName, styleData)
    
    let citation = new Cite(cslData);
    let test2 = citation.format('bibliography', {
        format: 'text',
        template: templateName,
        lang: 'en-us'
    })


    return test2;
}