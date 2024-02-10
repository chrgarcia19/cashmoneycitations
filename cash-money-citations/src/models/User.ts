import mongoose from "mongoose";

export interface Users extends mongoose.Document {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema<Users>({
    username: {
        /*The username associated with the account*/
        type: String,
        required: [true, "Please provide a username for the user."],
    },
    first_name: {
        /* The name of the user */

        type: String,
        required: [true, "Please provide a first name for the user."],
        maxlength: [30, "First name cannot be more than 30 characters"],
    },
    last_name: {
        /* The name of the user */

        type: String,
        required: [true, "Please provide a Last name for the user."],
        maxlength: [30, "Last name cannot be more than 30 characters"],
    },
    email: {
        /* The email of the user */

        type: String,
        required: [true, "Please provide the user's email"],
        maxlength: [60, "Email cannot be more than 60 characters"],
    },
    password: {
        /* The password of the user */

        type: String,
        required: [true, "Please provide the user's password"],
        minlength: [8, "Password must be at least 8 characters"],
    },
});

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);
