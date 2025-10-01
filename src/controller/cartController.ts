import { Response } from "express";
import mongoose from "mongoose";
import Cart, { ICart } from "../models/cartModel";
import Product from "../models/productmodels";
import { AuthRequest } from "../types/express";

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("products.product")
      .exec();

    // Filter out any items where product is null (deleted products)
    if (cart && cart.products) {
      cart.products = cart.products.filter(item => item.product != null);
      await cart.save();
    }

    res.json(cart || { user: req.user._id, products: [] });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate inputs
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if product exists and is available
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!existingProduct.isActive) {
      return res.status(400).json({ message: "Product is not available" });
    }

    if (existingProduct.stock < quantity) {
      return res.status(400).json({ 
        message: `Only ${existingProduct.stock} items available in stock` 
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ 
        user: req.user._id, 
        products: [] 
      });
    }

    // Clean up any null product references first
    cart.products = cart.products.filter(item => item.product != null);

    const itemIndex = cart.products.findIndex(
      (p) => p.product && p.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update existing item
      cart.products[itemIndex].quantity += quantity;
      
      // Check stock for updated quantity
      if (existingProduct.stock < cart.products[itemIndex].quantity) {
        return res.status(400).json({ 
          message: `Cannot add more than available stock (${existingProduct.stock})` 
        });
      }
    } else {
      // Add new item
      cart.products.push({ 
        product: new mongoose.Types.ObjectId(productId), 
        quantity 
      });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("products.product");

    res.json(updatedCart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (quantity <= 0) {
      return removeFromCart(req, res);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Clean up any null product references first
    cart.products = cart.products.filter(item => item.product != null);

    const itemIndex = cart.products.findIndex(
      (p) => p.product && p.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Only ${product.stock} items available in stock` 
      });
    }

    cart.products[itemIndex].quantity = quantity;
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("products.product");

    res.json(updatedCart);
  } catch (err) {
    console.error("Update cart item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Remove the item and clean up any null references
    cart.products = cart.products.filter(
      (p) => p.product && p.product.toString() !== productId
    );

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("products.product");

    res.json(updatedCart);
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};