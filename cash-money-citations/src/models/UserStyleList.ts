import mongoose, { Schema } from 'mongoose';

const UserStyleListSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    styleList: [{
        type: Schema.Types.ObjectId,
        ref: 'CitationModel'
    }],
});

// Define the default styles
const defaultStyles = ['Default Style 1', 'Default Style 2']; // replace with your default style titles

UserStyleListSchema.pre('save', async function(next) {
    // `this` refers to the UserStyleList document being saved
    const userStyleList = this;

    // Get all styles from the CitationModel collection
    const styles = await mongoose.model('CitationModel').find();

    // Check each style to see if it matches a default style
    for (const style of styles) {
        if (defaultStyles.includes(style.title)) {
            // If the style matches a default style and it's not already in the styleList, add it
            if (!userStyleList.styleList.includes(style._id)) {
                userStyleList.styleList.push(style._id);
            }
        }
    }

    next();
});

export default mongoose.models.UserStyleListModel || mongoose.model("UserStyleListModel", UserStyleListSchema);