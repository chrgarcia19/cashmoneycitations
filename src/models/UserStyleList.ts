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
    defaultStyles: [{
        type: String,
        default: [
            "Modern Language Association 7th edition",
            "Modern Language Association 8th edition",
            "Modern Language Association 9th edition",
            "American Psychological Association 7th edition",
            "Chicago Manual of Style 17th edition (author-date)",
            "Chicago Manual of Style 17th edition (full note)",
            "Chicago Manual of Style 17th edition (note)",
            "ACM SIGGRAPH",
            "IEEE",
        ]
    }],
});



export default mongoose.models.UserStyleListModel || mongoose.model("UserStyleListModel", UserStyleListSchema);