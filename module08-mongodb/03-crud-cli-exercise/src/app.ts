import { Command } from 'commander';
import type { ProductType } from '#types';
import '#db';
import { Product } from '#models';

const program = new Command();
program
  .name('ecommerce-cli')
  .description('Simple product CRUD CLI')
  .version('1.0.0');

// READ - List all products
program
  .command('list')
  .description('List all products')
  .action(async () => {
    const products = await Product.find();
    console.log(products);
  });

// CREATE
program
  .command('add')
  .description('Add a new product')
  .argument('<name>', 'Product name')
  .argument('<stock>', 'Stock quantity')
  .argument('<price>', 'Product price')
  .argument('<tags>', 'Comma-separated tags')
  .action(async (name, priceStr, stockStr, tagsStr) => {
    const stock = +stockStr; //+ Converts strings to numbers
    const price = +priceStr; //+ Converts strings to numbers
    const tags = tagsStr.split(','); //Eg: "clothing, unisex" => ["clothing", "unisex"]

    //You can create a type alias for TS support.
    const newProduct = await Product.create<ProductType>({
      name,
      stock,
      price,
      tags,
    });
    console.log(`New product: ${newProduct}`);
  });

// READ - Get product by id
program
  .command('get')
  .description('Get product by ID')
  .argument('<id>', 'Product ID')
  .action(async (id) => {
    const product = await Product.findById(id);
    console.log(product);
  });

// SEARCH - search by tags
program
  .command('search')
  .description('Search products by tag')
  .argument('<tag>', 'Product tag')
  .action(async (tag) => {
    const products = await Product.find({ tags: tag });
    console.log(products);
  });

// UPDATE
program
  .command('update')
  .description('Update a product by ID')
  .argument('<id>', 'Product ID')
  .argument('<name>', 'Product name')
  .argument('<stock>', 'Stock quantity')
  .argument('<price>', 'Product price')
  .argument('<tags>', 'Comma-separated tags')
  .action(async (id, name, priceStr, stockStr, tagsStr) => {
    const stock = +stockStr; //+ Converts strings to numbers
    const price = +priceStr; //+ Converts strings to numbers
    const tags = tagsStr.split(','); //Eg: "clothing, unisex" => ["clothing", "unisex"]

    const result = await Product.findByIdAndUpdate(
      id, //First mongoose looks for the document by ID and then updates everything.
      {
        name,
        stock,
        price,
        tags,
      },
      { new: true } //Returns the updated document back which is stored in variable result
    );
    console.log(result);
  });

// DELETE - delete product by id
program
  .command('delete')
  .description('Delete product by ID')
  .argument('<id>', 'Product ID')
  .action(async (id) => {
    await Product.findByIdAndDelete(id);
    console.log(`Product deleted with id: ${id}`);
  });

// after all commands
program.hook('postAction', () => process.exit(0));
program.parse();
