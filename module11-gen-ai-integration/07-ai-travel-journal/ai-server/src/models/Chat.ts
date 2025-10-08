import { Schema, model } from 'mongoose';

// update message schema to allow for tool call messages
const messageSchema = new Schema({
  role: {
    type: String,
    enum: ['assistant', 'developer', 'function', 'system', 'tool', 'user'],
    required: true
  },
  // content is no longer required, since messages for tool calling won't include it
  content: String,
  // another optional property for tool call messages
  tool_call_id: String,
  // set default to null instead of empty array to allow for easier truthiness checks
  tool_calls: { type: [{}], default: null }
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
