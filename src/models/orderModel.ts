import { Schema, model, InferSchemaType, Types } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }, 
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "shipped"], default: "pending" },
  },
  { timestamps: true }
);

export type IOrder = InferSchemaType<typeof orderSchema> & { _id: Types.ObjectId };
export default model<IOrder>("Order", orderSchema);