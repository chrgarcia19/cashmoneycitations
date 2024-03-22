import mongoose, { Schema } from 'mongoose';

const CitationSchema = new Schema ({
    name: String,
    style: String,
    CitationData: Object,
    language: String,
    isOwnedBy: [String],
})

export default mongoose.models.CitationModel || mongoose.model("CitationModel", CitationSchema); 