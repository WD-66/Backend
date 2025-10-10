import { Schema, model } from 'mongoose';

// update message schema to allow for tool call messages
const messageSchema = new Schema({
  role: {
    type: String,
    enum: ['assistant', 'user'],
    required: true
  },
  content: { type: String, required: true }
});

const chatSchema = new Schema(
  {
    history: {
      type: [messageSchema],
      default: []
    }
  },
  { timestamps: true }
);

export default model('Chat', chatSchema);
