'use server'
import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex"
import { HandleInitialFormat, HandleContributors } from "@/components/componentActions/citationActions"
import { LogCMCError } from "./logActions";

export async function EditReference(form: any, id: any) {
    await dbConnect();
    try {
        // Add ref id to form
        form.id = id;

        // Ensures that unique contributor fields will be updated
        await HandleContributors(form);

        // Essentially puts it throught the same process the initial form takes when being made
        await HandleInitialFormat(form);
        await CSLBibModel.findByIdAndUpdate(id, form, {
        new: true,
        runValidators: true,})
    } catch(e: any) {
        LogCMCError("WARNING", "REFERENCE", e)
        console.error(e);
    }
}