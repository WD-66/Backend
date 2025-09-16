import '#db';
import { User, Post } from '#models';

type NewUser = {
  firstName: string;
  email: string;
  age: number;
};

const createUser = async (user: NewUser) => {
  try {
    const newUser = await User.create<NewUser>(user);
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

const createPost = async () => {
  try {
    const newPost = new Post({
      title: 'post one',
      content: 'This is my first post',
      author: '68c971f1f910637b43843f20',
    });
    newPost.title = 'Post two'; //Lets you manipulate the new post object before saving
    await newPost.save();
    console.log(newPost);
  } catch (error) {
    console.log(error);
  }
};

const getAllPosts = async () => {
  try {
    const allPosts = await Post.find().populate(
      'author', //The name of the property you want to populate
      'firstName email -_id' //The fields from the user document you want to include in the population
    );
    console.log(allPosts);
  } catch (error) {
    console.log(error);
  }
};

// createUser({
//   firstName: 'Mary',
//   email: 'mary@gmail.com',
//   age: 35,
// });

// getAllUsers();

// createPost();
getAllPosts();
