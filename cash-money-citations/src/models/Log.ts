import mongoose, { Schema } from 'mongoose';

enum CMCLogType {
    User = "USER",
    DataBase = "DATABASE",
    NextJsServer = "NEXTJSSERVER",
    Refernce = "REFERENCE",
    Citation = "CITATION",
    CslStyle = "CSLSTYLE",
}

const CMCLog = new Schema ({
    name: String,
    logType: {
        type: String,
        enum: CMCLogType
    },
    data: String,
}, {timestamps: true});


export default mongoose.models.CMCLogModel || mongoose.model("CMCLogModel", CMCLog); 