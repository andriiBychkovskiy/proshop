import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModal.js";
import Product from "./models/productModal.js";
import Order from "./models/orderModal.js";
import connectDB from "./config/db.js";

// Enable colors
colors.enable();

dotenv.config();
connectDB();

const importData = async (): Promise<void> => {
  try {
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    const createdUsers = await User.insertMany(users);

    if (createdUsers.length === 0) {
      throw new Error("No users were created");
    }

    const adminUser = createdUsers[0]!._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async (): Promise<void> => {
  try {
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
