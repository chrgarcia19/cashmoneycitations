import { authConfig } from "@/lib/auth";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import User from "./User";

async function getUserId() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ?? '';
  return userId;
}

export interface Tag extends mongoose.Document {
    tagName: string;
    tagColor: string;
    referenceId: string[];
}

const TagSchema = new mongoose.Schema<Tag>({
    tagName: {
      type: String,
    },
    tagColor: {
      type: String,
    },
    referenceId: {
      type: [String],
    },
}, {timestamps: true});

TagSchema.pre('save', async function (next) {
  const tag = this as Tag;
  const userId = await getUserId();

  // Retrieve the owner of the reference
  const owner = await User.findById(userId).select('ownedTags');

  // If the owner doesn't exist or the tag is not in the owner's list of ownedTags, invalidate the document
  if (!owner || !owner.ownedTags.includes(tag._id)) {
    this.invalidate('owner', 'Owner not found or does not own this tag');
  }

  next();
});

export default mongoose.models.Tag || mongoose.model<Tag>("Tag", TagSchema, "tags");