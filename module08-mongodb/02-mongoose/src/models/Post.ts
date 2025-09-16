import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  title: String,
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user', //This needs to be the same name you give when defining the User model on User.ts
  },
});

export default model('post', postSchema);
