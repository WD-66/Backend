import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    image: {
      type: String,
      required: [true, 'Image is required'],
      default:
        'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const User = model('User', userSchema);

export default User;
