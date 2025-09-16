import '#db';
import { User } from '#models';

type NewUser = {
  firstName: string;
  email: string;
  age: number;
};

const createUser = async (user: NewUser) => {
  try {
    const newUser = await User.create(user);
    console.log('User created successfully', newUser);
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async () => {
  try {
    const allUsers = await User.find({ firstName: 'John' });
    console.log(allUsers);
  } catch (error) {
    console.log(error);
  }
};

// createUser({
//   firstName: 'Mary',
//   email: 'mary@gmail.com',
//   age: 35,
// });
getAllUsers();
