'use server'

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
export async function GetBibLaTexFile(referenceId: string, lang: string) {
    let referenceData = await CSLBibModel.findById(referenceId)

    const cslJson = referenceData.cslJson

    const citation = new Cite(cslJson);

    // Find locale where name = inputted locale
    const localeData = await CSLLocaleModel.findOne({
        name: lang,
    }).exec()

    const config = plugins.config.get('@csl')

    config.locales.add(lang, localeData?.localeData);

    // Create custom citation with user specified style & locale
    const customCitation = citation.format('biblatex', {
        format: 'text',
        template: "biblatex",
        lang: lang,
    });

    return customCitation;
}

export async function GetBibTexFile(referenceId: string, lang: string) {
    let referenceData = await CSLBibModel.findById(referenceId)

    const cslJson = referenceData.cslJson

    const citation = new Cite(cslJson);

    // Create custom citation with user specified style & locale
    const customCitation = citation.format('bibtex', {
        format: 'text',
        template: "bibtex",
        lang: lang,
    });

    return customCitation;
}

export async function GetJSONFile(referenceId: string, lang: string) {
    let referenceData = await CSLBibModel.findById(referenceId)

    const cslJson = referenceData.cslJson

    const citation = new Cite(cslJson);
    // Create custom citation with user specified style & locale
    const customCitation = citation.format('data', {
        format: 'object',
        template: "data",
        lang: lang,
    });


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