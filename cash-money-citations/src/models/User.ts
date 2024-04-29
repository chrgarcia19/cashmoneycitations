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
    ownedTags: [string],
    ownedGroups: [string],
    ownedCitations: [string],
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema<Users>({
    username: {
        /*The username associated with the account*/
        type: String,
        minlength: [4, "Must be at least 4 characters long, got {VALUE}"],
        maxlength: [24, "Maximum of 24 characters, got {VALUE}"],
        required: true,
        unique: true,
    },
    firstName: {
        /* The name of the user */
        type: String,
        minlength: [1, "Must be at least 1 characters long, got {VALUE}"],
        maxlength: [64, "Must be less than 64 characters long, got {VALUE}"],
        required: false,
    },
    lastName: {
        /* The name of the user */
        type: String,
        minlength: [1, "Must be at least 1 characters long, got {VALUE}"],
        maxlength: [64, "Must be less than 64 characters long, got {VALUE}"],
        required: false,
    },
    email: {
        /* The email of the user */
        type: String,
        minlength: [4, "Must be at least 4 characters long, got {VALUE}"],
        maxlength: [72, "Must be less than 72 characters long, got {VALUE}"],
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        /* The password of the user */
        type: String,
        minlength: [6, "Must be at least 6 characters long, got {VALUE}"],
        validate: {
            validator: function(v: any) {
              return /\d/.test(v); // should contain at least one digit
            },
            message: props => `${props.value} should contain at least one digit!`
        },
        required: [true, "User password is required"],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    accounts: [{
        provider: String,
        providerAccountId: String,
    }],
    ownedReferences: [String],
    ownedTags: [String],
    ownedGroups: [String],
    ownedCitations: [String],
}, {timestamps: true});

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);
