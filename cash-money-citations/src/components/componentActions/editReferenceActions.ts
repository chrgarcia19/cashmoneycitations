'use server'
import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex"


export async function EditReference(form: any, id: any) {
    await dbConnect();
    try {
        await CSLBibModel.findByIdAndUpdate(id, form, {
        new: true,
        runValidators: true,})
    } catch(error) {
        console.error(error)
    }
}