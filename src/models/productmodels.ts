import { Schema, model, Types, Document } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 10},
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[]; 
  category: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IProductDocument = IProduct & Document;
export default model<IProductDocument>("Product", productSchema);
