import mongoose, { Schema } from 'mongoose';
import CSLBibTex from './CSLBibTex';

const CitationSchema = new Schema ({
    name: String,
    style: String,
    CitationData: Object,
    language: String,
    isOwnedBy: [String],
})

CitationSchema.pre('findOneAndDelete', async function(next) {
    // this refers to the query
    const citation = await this.model.findOne(this.getFilter());
    // Now citation refers to the document that will be deleted
    await CSLBibTex.updateMany(
        { citationIdList: citation._id }, 
        { $pull: { citationIdList: citation._id } }
    );

    next();
});

export default mongoose.models.CitationModel || mongoose.model("CitationModel", CitationSchema); 