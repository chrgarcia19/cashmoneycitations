import mongoose, { Schema } from 'mongoose';

enum CMCLogType {
    User = "USER",
    DataBase = "DATABASE",
    NextJsServer = "NEXTJSSERVER",
    Refernce = "REFERENCE",
    Citation = "CITATION",
    CslStyle = "CSLSTYLE",
}

enum Priority {
    Critival = "CRITICAL",
    Warning = "WARNING",
    Information = "INFORMATION",
}

const CMCLog = new Schema ({
    priority: {
        type: String,
        enum: Priority
    },
    name: String,
    logType: {
        type: String,
        enum: CMCLogType
    },
    data: String,
}, {timestamps: true});


export default mongoose.models.CMCLogModel || mongoose.model("CMCLogModel", CMCLog); 