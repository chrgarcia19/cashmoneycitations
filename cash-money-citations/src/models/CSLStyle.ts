import mongoose, { Schema } from 'mongoose';

const CSLStyleSchema = new Schema ({
    name: String,
    cslData: Object,
    isDependent: Boolean,
})

export default mongoose.models.CSLStyleModel || mongoose.model("CSLStyleModel", CSLStyleSchema); 