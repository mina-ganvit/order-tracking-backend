import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./../models/user";
import { loginSchema, registerSchema } from "./../validation/user";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User registered", user: newUser });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
