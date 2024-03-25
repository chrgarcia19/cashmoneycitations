import mongoose from "mongoose";

export interface Users extends mongoose.Document {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    accounts: [{
        provider: string,
        providerAccountId: string,
    }],
    ownedReferences: [string],
    ownedCitations: [string],
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema<Users>({
    username: {
        /*The username associated with the account*/
        type: String,
    },
    firstName: {
        /* The name of the user */

        type: String,
    },
    lastName: {
        /* The name of the user */

        type: String,
    },
    email: {
        /* The email of the user */

        type: String,
    },
    password: {
        /* The password of the user */

        type: String,
    },
    role: {
        type: String,
        default: 'user',
    },
    accounts: [{
        provider: String,
        providerAccountId: String,
    }],
    ownedReferences: [String],
    ownedCitations: [String],
}, {timestamps: true});

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);
