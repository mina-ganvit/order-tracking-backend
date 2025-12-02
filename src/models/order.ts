import { Schema, model, Document } from "mongoose";

export interface IOrderItem {
  name: string;
  quantity: number;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
}

const orderItemSchema = new Schema<IOrderItem>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
