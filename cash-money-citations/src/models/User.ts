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
    },
    first_name: {
        /* The name of the user */

        type: String,
    },
    last_name: {
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
});

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);
