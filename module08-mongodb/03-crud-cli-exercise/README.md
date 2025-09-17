# CRUD CLI

## Objective

Build a complete CLI tool using TypeScript and Mongoose to perform full CRUD operations like Create, Read, Update, and Delete on an eCommerce-style product list.

### This exercise covers how to:

- Run TypeScript files in Node.js
- Connect to a MongoDB database
- Perform database operations from the terminal
- Handle command-line arguments using commander

Commander (`commander`) is built on top of Node.js’s native `process.argv` array — which holds all the arguments passed to your CLI script.

It makes it easier to:

- Parse and validate CLI arguments
- Structure commands and subcommands clearly
- Add descriptions, help text, and default values for a better CLI experience

It’s perfect for projects where you want a user-friendly and scalable terminal tool.

---

## Setup

We’ll guide you through most of the scaffolding and then you can take it from there!

1. Clone this repo
2. Remove the existing git history and reinitialize

   ```bash
   #Remove git history
   rm -rf .git

   #Reinitialize git
   git init
   ```

3. Install dependencies `npm install`. Mongoose and commander will also be installed when you run this command.
4. Create a `.env` file and include your MongoDB connection string. Do NOT commit this file to your repo. Add it to `.gitignore`.
5. **Scripts in `package.json`** - This project is a pure CLI tool — no server, no build step needed. That’s why we only use a single start script in `package.json`.

   - We load environment variables using `--env-file=.env`
   - No `--watch` flag since we are not auto-reloading during development.
   - No build, prestart, or dist output — this CLI runs directly with TypeScript via node.

   ```bash
   "scripts": {
   "start": "node --env-file=.env src/app.ts"
   }

   #If you are using Node.js v22, make sure to add the experimental flags
   "scripts": {
   "start": "node --experimental-transform-types --disable-warning=ExperimentalWarning --env-file=.env src/app.ts"
    },
   ```

6. **Import paths and aliases** - Since we want to use `#` as a path alias. Eg: `import { db } from '#db'`, we need to configure this first in two places.
   1. `tsconfig.json` via the `paths` option, this is already done for you.
   2. `package.json` via the imports field. You can add a `#db` field in the `imports`
      ```bash
      "imports": {
          "#db": "./src/db/index.ts"
          }
      ```
7. Now we actually need to create `src/db/index.ts`.
   ```js
   import mongoose from 'mongoose';
   try {
       // Connect
       await mongoose.connect(process.env.MONGO_URI!, {
           dbName: 'mongoose'
       });
       //The special characters like `\x1b[35m` and `\x1b[0m` are ANSI escape codes used to add color to terminal output.
       console.log('\x1b[35mMongoDB connected via Mongoose\x1b[0m');
   } catch (error) {
       console.error('MongoDB connection error:', error);
       process.exit(1);
   }
   ```
8. We can use our database connection in `app.ts`
   ```js
   import '#db';
   ```

---

### A bit about commander

As we already mentioned, [Commander](https://www.npmjs.com/package/commander) is a popular library in Node.js for building command-line interfaces (CLIs). It helps you define commands, arguments, options, and actions in a structured way.

Take this example (The complete scaffold can be found in `src/app.ts`).

```js
import '#db';
import { Command } from 'commander';

const program = new Command();
program
  .name('ecommerce-cli')
  .description('Simple product CRUD CLI')
  .version('1.0.0');

// LIST ALL
program
  .command('list')
  .description('List all products')
  .action(async () => {
    console.log('CLI application was called with list command');
  });

// ADD
program
  .command('add')
  .description('Add a new product')
  .argument('<name>', 'Product name')
  .argument('<stock>', 'Stock quantity')
  .argument('<price>', 'Product price')
  .action(async (name, stockStr, priceStr) => {
    console.log('CLI application was called with add command with arguments:', {
      name,
      stockStr,
      priceStr,
    });
  });

program.hook('postAction', () => process.exit(0));
program.parse();
```

#### Here's a little explanation of the code above

- We start by creating the CLI tool and giving it basic metadata. This gives your CLI a name, description, and version.

  ```js
  const program = new Command();
  program
    .name('ecommerce-cli')
    .description('Simple product CRUD CLI')
    .version('1.0.0');
  ```

- Then you can start registering commands for your program

  ```js
  program
  .command('add')
  .description('Add a new product')
  .argument('<name>', 'Product name')
  .argument('<stock>', 'Stock quantity')
  .argument('<price>', 'Product price')
  .action((name, stockStr, priceStr) => { ... });
  ```

  This creates a command you can run like

  ```js
  npm start add "Laptop" 10 1499.99
  ```

  - It expects 3 required arguments: name, stock, price.
  - These get passed to the .action() function as parameters.

- You can also have commands with no arguments.
  ```js
  program
  .command('list')
  .description('List all products')
  .action(() => { ... });
  ```
  Just runs a function when the user types `npm start list`
- You can also tap into what happens before and after each action
  ```js
  program.hook('postAction', () => process.exit(0));
  ```
  - Helps when using async functions.
  - Makes sure the CLI doesn’t hang after doing its job.
- Never forget to call parse so Commander parses the argument list!
  ```js
  program.parse();
  ```
  Tells Commander to look at the user’s input (from the terminal) and run the right command.

---

## Your tasks

Now it’s your turn to register commands to perform CRUD operations from the CLI. All the products will be stored in MongoDB (locally or in atlas).

Create a model for the product in a folder called `models`. Import this model into `app.ts` to run queries in the `action()` method.

### Product Schema

Each product in MongoDB should look like

```js
{
  name: 'T-Shirt',
  price: 19.99,
  stock: 50,
  tags: ['clothing', 'unisex'],
  created_at: new Date()
}
```

### CLI commands to implement

| Description            | Command                                                          | Example Command                                                                 |
| ---------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| List all products      | `npm start list`                                                 | `npm start list`                                                                |
| Get product by ID      | `npm start get <id>`                                             | `npm start get 665f1a2b3c4d5e6f7a8b9c0d`                                        |
| Search products by tag | `npm start search <tag>`                                         | `npm start search clothing`                                                     |
| Add a new product      | `npm start add "<name>" <price> <stock> "<tag1,tag2,…>"`         | `npm start add "T-Shirt" 19.99 50 "clothing,unisex"`                            |
| Update product by ID   | `npm start update <id> "<name>" <price> <stock> "<tag1,tag2,…>"` | `npm start update 665f1a2b3c4d5e6f7a8b9c0d "Hoodie" 29.99 30 "clothing,unisex"` |
| Delete product by ID   | `npm start delete <id>`                                          | `npm start delete 665f1a2b3c4d5e6f7a8b9c0d`                                     |
