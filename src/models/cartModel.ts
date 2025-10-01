import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICartProduct {
  product: Types.ObjectId;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  products: ICartProduct[];
}

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
        selectedSize: { type: String },
        selectedColor: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;