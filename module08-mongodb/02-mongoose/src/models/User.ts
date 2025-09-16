import { Schema, model, type ValidatorProps } from 'mongoose';

const addressSchema = new Schema({
  street: String,
  houseNumber: String,
  city: String,
});

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
      default: 10,
    },
    address: {
      type: addressSchema,
      default: { street: '', city: 'Berlin', houseNumber: '' },
    },
  },
  { timestamps: true } //Adds createdAt and updatedAt fields
);

const User = model('user', userSchema);

export default User;
