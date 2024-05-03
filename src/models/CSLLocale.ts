import mongoose, { Schema } from 'mongoose';

const CSLLocaleSchema = new Schema ({
    name: String,
    localeData: Object,
})

export default mongoose.models.CSLLocaleModel || mongoose.model("CSLLocaleModel", CSLLocaleSchema); 