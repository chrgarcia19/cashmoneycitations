'use server'

import CSLBibModel from "@/models/CSLBibTex";
import CitationModel from "@/models/Citation";

export async function DeleteCitation(citationId: string) {
    await CitationModel.findOneAndDelete({ _id: citationId });
}

export async function GetCitations(referenceId: any) {

    const reference = await CSLBibModel.findById(referenceId);

    const citationList = [];

    for (const citationId of reference.citationIdList) {
        let citation = await CitationModel.findById(citationId);

        citationList.push(citation)
    }

    return citationList;


}