"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 10 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String }],
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Product", productSchema);
