import mongoose from "mongoose";

export interface Users extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    age: number;
    address: string;
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema<Users>({
    name: {
        /* The name of the user */

        type: String,
        required: [true, "Please provide a name for the user."],
        maxlength: [60, "Name cannot be more than 60 characters"],
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
    age: {
        /* User's age, if applicable */

        type: Number,
    },
    address: {
        /* User's address, if applicable */

        type: String,
    },
});

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);
