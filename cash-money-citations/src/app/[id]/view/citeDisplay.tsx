'use server'
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
const { plugins } = require('@citation-js/core')
const fs = require('fs');

export default async function CiteDisplay(cslData: any) {


    const styleData = fs.readFileSync("/home/vyre/cmc/cashmoneycitations/cash-money-citations/src/app/[id]/view/harvard-cite-them-right.csl", 'utf8');

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