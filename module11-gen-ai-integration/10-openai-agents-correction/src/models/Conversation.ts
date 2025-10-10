import { Schema, model } from 'mongoose';

const conversationSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default model('Conversation', conversationSchema);
