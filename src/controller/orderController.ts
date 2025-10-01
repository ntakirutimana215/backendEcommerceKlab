import { RequestHandler } from "express";
import mongoose from "mongoose";
import Order from "../models/orderModel";
import Product, { IProductDocument } from "../models/productmodels";
import Cart, { ICart } from "../models/cartModel";
import { AuthRequest } from "../types/express";

/**
 * Create an order from the current user's cart.
 * Skips products that are missing or have insufficient stock.
 */
export const createOrderFromCart: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;

  try {
    // Find user's cart and populate products
    const cart = await Cart.findOne({ user: authReq.user?._id })
      .populate("products.product") as ICart | null;

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems: { product: string; quantity: number }[] = [];
    const skippedProducts: string[] = [];

    for (const item of cart.products) {
      let productDoc: IProductDocument | null = null;

      // Type guard: is it already populated?
      if (item.product && typeof item.product === "object" && item.product && "_id" in item.product) {
        productDoc = item.product as unknown as IProductDocument;
      }

      // Otherwise, it's an ObjectId — fetch from DB
      else if (mongoose.Types.ObjectId.isValid(item.product as any)) {
        const productId = item.product as unknown as string; // safe conversion
        productDoc = await Product.findById(productId);
      }

      if (!productDoc) {
        const prodId = typeof item.product === "object" && item.product && "_id" in item.product
          ? item.product._id.toString()
          : (item.product as unknown as string);
        skippedProducts.push(prodId);
        continue;
      }

      // Check stock
      if (productDoc.stock < item.quantity) {
        skippedProducts.push(productDoc.name || productDoc._id.toString());
        continue;
      }

      // Calculate total and reduce stock
      totalAmount += productDoc.price * item.quantity;
      productDoc.stock -= item.quantity;
      await productDoc.save();

      // Add to order items
      orderItems.push({ product: productDoc._id.toString(), quantity: item.quantity });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "No products available for order", skippedProducts });
    }

    // Create the order
    const order = await Order.create({
      user: authReq.user?._id,
      items: orderItems,
      totalAmount,
      status: "pending",
    });

    // Remove ordered products from cart
    cart.products = cart.products.filter(p => {
      const prodId = typeof p.product === "object" && p.product && "_id" in p.product
        ? p.product._id.toString()
        : (p.product as unknown as string);
      return !orderItems.find(o => o.product === prodId);
    });
    await cart.save();

    return res.status(201).json({
      message: "Order created successfully",
      order,
      skippedProducts: skippedProducts.length > 0 ? skippedProducts : undefined,
    });

  } catch (err) {
    console.error("Order from cart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all orders of the logged-in user
 */
export const getMyOrders: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const orders = await Order.find({ user: authReq.user?._id }).populate("items.product");
    return res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all orders (admin use case)
 */
export const getAllOrders: RequestHandler = async (_req, res) => {
  try {
    const orders = await Order.find()  .populate("items.product").populate("user", "fullname email");
    return res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update order status
 */
export const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("items.product").populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
