import mongoose, { Schema } from 'mongoose';
import UserStyleList from './UserStyleList';

const CSLStyleSchema = new Schema ({
    name: String,
    title: String,
    titleShort: String,
    cslData: Object,
    isDependent: Boolean,
});

export default mongoose.models.CSLStyleModel || mongoose.model("CSLStyleModel", CSLStyleSchema); 