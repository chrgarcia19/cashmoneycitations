import mongoose from "mongoose";

export interface Tag extends mongoose.Document {
    tagName: string;
    referenceID: string[];
}

const TagSchema = new mongoose.Schema<Tag>({
    tagName: {
      type: String
    },
    referenceID: {
      type: [String],
    },
}, {timestamps: true});

export default mongoose.models.Tag || mongoose.model<Tag>("Tag", TagSchema, "tags");