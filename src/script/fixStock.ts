import mongoose from "mongoose";
import Product from "../models/productmodels";

async function updateStock() {
  await mongoose.connect("mongodb://localhost:27017/Ecom_db");

  await Product.updateOne(
    { _id: "68d255a4ade9012512141cc5" },
    { $set: { stock: 10 } }
  );

  await Product.updateOne(
    { _id: "68c1777cd360d8ac61f16f85" },
    { $set: { stock: 20 } }
  );

  await Product.updateOne(
    { _id: "68c27d28cdae7514ed0f7d10" },
    { $set: { stock: 5 } }
  );

  console.log("Stock updated ✅");
  process.exit();
}

updateStock();
