import mongoose, { Schema } from 'mongoose';

enum CMCLogType {
    User = "USER",
    DataBase = "DATABASE",
    NextJsServer = "NEXTJSSERVER",
    Reference = "REFERENCE",
    Citation = "CITATION",
    CslStyle = "CSLSTYLE",
    Group = "GROUP",
    Tag = "TAG"
}

enum Priority {
    Critival = "CRITICAL",
    Warning = "WARNING",
    Information = "INFORMATION",
    Success = "SUCCESS",
    Failed = "FAILED",
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