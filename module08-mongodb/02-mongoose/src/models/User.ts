import { Schema, model, type ValidatorProps } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Pls enter first name'],
    },
    email: {
      type: String,
      required: true,
      //Custom validation to allow only gmail email addresses
      validate: {
        validator: function (v: string) {
          return /gmail\.com/.test(v);
        },
        message: (props: ValidatorProps) =>
          `${props.value} is not allowed. Only gmail addresses!`,
      },
    },
    age: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true } //Adds createdAt and updatedAt fields
);

const User = model('user', userSchema);

export default User;
