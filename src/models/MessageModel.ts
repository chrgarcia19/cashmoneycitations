import mongoose from 'mongoose';

// Message schema
const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
}, {
  timestamps: true,
});

// Prevent model overwrite upon restart
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
