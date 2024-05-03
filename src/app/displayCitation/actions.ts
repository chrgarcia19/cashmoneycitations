'use server'

require('@citation-js/plugin-bibtex')
require('@citation-js/plugin-bibjson')
require('@citation-js/core')
import CSLBibModel from "@/models/CSLBibTex";
import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";
import CSLLocaleModel from "@/models/CSLLocale";
import CitationModel from "@/models/Citation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import UserStyleList from "@/models/UserStyleList";
import { LogCMCError } from "@/components/componentActions/logActions";

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
    cslJson[0].refId = reference._id.toString();
    return cslJson;

}

export async function GetCSLStyle(templateName: string) {

    try {
        // Find citation style where the name = the selected list
        const styleData = await CSLStyleModel.findOne({
            title: templateName,
        }).exec()
        let styledataObject = styleData.toObject();
        styledataObject._id = styledataObject._id.toString();

        return styledataObject;
    } catch(e: any) {
        LogCMCError("WARNING", "CSLSTYLE", e);
        console.log(e)
    }


}

export async function GetCSLLocale(localeName: string) {

    try {
        // Find locale where name = inputted locale
        const localeData = await CSLLocaleModel.findOne({
            name: localeName,
        }).exec()
        let localeDataObject = localeData.toObject();
        localeDataObject._id = localeDataObject._id.toString();

        return localeDataObject;
    } catch(e) {
        console.log(e)
    }

}

export async function UpdateUserStyleList(newStyles: string[] | string, removeStyle: boolean) {

    await dbConnect();

    try {
        const session = await getServerSession(authConfig);
        const userId = session?.user?.id ?? '';
    
        if (removeStyle == false) {
            await UserStyleList.updateOne({
                userId: userId},
                { $push: { defaultStyles: { $each: newStyles }}}
            );
        } else {
            
            await UserStyleList.updateOne({
                userId: userId},
                { $pull: { defaultStyles: newStyles}}
            );
        }

    
    } catch(e) {
        console.error(e);
    }

}