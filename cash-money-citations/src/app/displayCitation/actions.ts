'use server'

import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex";
import CitationModel from "@/models/Citation";

export async function GetCitations(referenceId: any) {
    await dbConnect();

        const reference = await CSLBibModel.findById(referenceId);

        const citationList = [];

        for (const citationId of reference.citationIdList) {
            let citation = await CitationModel.findById(citationId);

            citationList.push(citation)
        }

        return citationList;


}