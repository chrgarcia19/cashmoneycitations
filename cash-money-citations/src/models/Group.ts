import { authConfig } from "@/lib/auth";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import User from "./User";

async function getUserId() {
    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';
    return userId;
}

export interface Group extends mongoose.Document {
    groupName: string;
    referenceId: string[];
}

const GroupSchema = new mongoose.Schema<Group>({
    groupName: {
        type: String,
    },
    referenceId: {
        type: [String],
    },
}, {timestamps: true});

GroupSchema.pre('save', async function (next) {
    const group = this as Group;
    const userId = await getUserId();
  
    // Retrieve the owner of the reference
    const owner = await User.findById(userId).select('ownedGroups');
  
    // If the owner doesn't exist or the tag is not in the owner's list of ownedTags, invalidate the document
    if (!owner || !owner.ownedGroups.includes(group._id)) {
      this.invalidate('owner', 'Owner not found or does not own this group');
    }
  
    next();
  });
  
  export default mongoose.models.Group || mongoose.model<Group>("Group", GroupSchema, "groups");