'use server'
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
const { plugins } = require('@citation-js/core')
const fs = require('fs');
import path from 'path';

export default async function CiteDisplay(cslData: any) {

    const stylePath = path.resolve('./csl_styles/harvard-cite-them-right.csl')
    const styleData = fs.readFileSync(stylePath, 'utf8');

    let templateName = 'chicago'
        
    const config = plugins.config.get('@csl')

    config.templates.add(templateName, styleData)
    
    let citation = new Cite(cslData);
    let test2 = citation.format('bibliography', {
        format: 'text',
        template: templateName,
        lang: 'en-us'
    })
    console.log(test2)


    return test2;
}