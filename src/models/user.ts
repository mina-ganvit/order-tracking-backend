import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  age?: number;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
