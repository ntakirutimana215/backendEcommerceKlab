import { Request, Response } from "express";
import Product from "../models/productmodels";
import streamifier from "streamifier";
import cloudinary from "../utils/cloudnaryConfig"; // your existing config

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price and category are required" });
    }

    const sizes = req.body.sizes
      ? Array.isArray(req.body.sizes)
        ? req.body.sizes
        : [req.body.sizes]
      : [];
    const colors = req.body.colors
      ? Array.isArray(req.body.colors)
        ? req.body.colors
        : [req.body.colors]
      : [];

    // Upload images to Cloudinary
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result as { secure_url: string });
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
        imageUrls.push(result.secure_url);
      }
    }

    const product = await Product.create({
      name,
      description: description || "",
      price: Number(price),
      stock: Number(stock),
      sizes,
      colors,
      category,
      images: imageUrls,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err: any) {
    console.error("Error creating product:", err);
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const updateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stock = Number(req.body.stock);

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.stock = stock;
    await product.save();

    res.json({ success: true, product });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
