import mongoose from "mongoose";

export interface Tag extends mongoose.Document {
    tagName: string;
    tagColor: string;
    referenceID: string[];
}

const TagSchema = new mongoose.Schema<Tag>({
    tagName: {
      type: String
    },
    tagColor: {
      type: String,
    },
    referenceID: {
      type: [String],
    },
}, {timestamps: true});

export default mongoose.models.Tag || mongoose.model<Tag>("Tag", TagSchema, "tags");