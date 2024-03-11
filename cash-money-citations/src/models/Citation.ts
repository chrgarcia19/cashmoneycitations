import mongoose, { Schema } from 'mongoose';

const CitationSchema = new Schema ({
    name: String,
    CitationData: Object,
})

export default mongoose.models.CitationModel || mongoose.model("CitationModel", CitationSchema); 