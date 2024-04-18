'use server'

import CSLBibModel from "@/models/CSLBibTex";
import CitationModel from "@/models/Citation";
import mongoose from "mongoose";

export async function DeleteCitation(citationId: string) {
    await CitationModel.findOneAndDelete({ _id: citationId });
}

export async function GetCitations(referenceId: string) {
    let reference = await CSLBibModel.findOne({_id: referenceId});

    if (!reference) {
        throw new Error(`No reference found with ID ${referenceId}`);
    }
    reference = reference.toObject(); // Convert to plain JavaScript object
    const citationList = [];

    
    for (const citationId of reference.citationIdList) {
        let citation = await CitationModel.findById(citationId);
        if (!citation) {
            throw new Error(`No citation found with ID ${citationId}`);
        }
        citation = citation.toObject(); // Convert to plain JavaScript object

        // If citation contains nested Mongoose documents, convert them to plain JavaScript objects
        for (const key in citation) {
            if (key === '_id') { // Convert the _id ObjectId to a string
                citation[key] = citation[key].toString();
            } else if (citation[key] instanceof mongoose.Document) {
                citation[key] = citation[key].toObject();
            }
        }

        citationList.push(citation);
    }
    return citationList;
}