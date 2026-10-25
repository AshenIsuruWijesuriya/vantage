import 'dotenv/config'; // load .env before the data files read it
import connectDB from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';
import products from './data/products.js';
import users from './data/users.js';

await connectDB();

const clearAll = () =>
  Promise.all([Order.deleteMany(), Product.deleteMany(), User.deleteMany()]);

try {
  if (process.argv[2] === '-d') {
    await clearAll();
    console.log('Data destroyed');
  } else {
    if (!process.env.ADMIN_PASSWORD || !process.env.CUSTOMER_PASSWORD) {
      throw new Error('Add ADMIN_PASSWORD and CUSTOMER_PASSWORD to server/.env');
    }
    await clearAll();
    await User.create(users); // create() runs the password-hashing hook
    await Product.insertMany(products);
    console.log(`Imported ${products.length} products and ${users.length} users`);
  }
  process.exit(0);
} catch (error) {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
}