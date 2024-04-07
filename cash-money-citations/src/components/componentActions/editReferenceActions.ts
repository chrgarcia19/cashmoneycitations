'use server'
import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex"
import { HandleInitialFormat, HandleContributors } from "@/components/componentActions/citationActions"

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
    } catch(error) {
        console.error(error)
    }
}