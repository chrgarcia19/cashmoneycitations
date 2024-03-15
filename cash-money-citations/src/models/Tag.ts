import mongoose from "mongoose";

export interface Tag extends mongoose.Document {
    name: string;
}

const TagSchema = new mongoose.Schema<Tag>({
    name: {
      type: String
    },
}, {timestamps: true});

export default mongoose.models.Tag || mongoose.model<Tag>("Tag", TagSchema, "tags");