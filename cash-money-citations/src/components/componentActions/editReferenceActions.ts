'use server'
import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex"
import { HandleInitialFormat } from "@/components/componentActions/citationActions"

export async function EditReference(form: any, id: any) {
    await dbConnect();
    try {
        // Add ref id to form
        form.id = id;
        await HandleInitialFormat(form);
        await CSLBibModel.findByIdAndUpdate(id, form, {
        new: true,
        runValidators: true,})
    } catch(error) {
        console.error(error)
    }
}