import { Request, Response } from "express";
import { Order } from "./../models/order";
import redis from "./../utils/redis";
import {
  createOrderValidation,
  updateOrderStatusValidation,
} from "../validation/order";
import { User } from "../models/user";

// CREATE ORDER
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { error } = createOrderValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }
    const { userId, items, totalAmount } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ status: 404, success: false, message: "User not found" });

    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
    });

    let redisKey = `order:${newOrder._id}`;
    await redis.set(redisKey, JSON.stringify(newOrder), {
      EX: 60 * 60,
    });
    const keys = await redis.keys("orders:page:*");
    if (keys.length > 0) {
      await redis.del(keys);
      console.log("Order cache cleared");
    }

    res.status(201).json({
      status: 201,
      success: true,
      message: "Order created",
      order: newOrder,
    });
  } catch (err: any) {
    console.log(err);

    res.status(500).json({ message: err.message });
  }
};

// UPDATE ORDER
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = updateOrderStatusValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const updated: any = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res
        .status(404)
        .json({ success: false, status: 404, message: "Order not found" });
    const keys = await redis.keys("orders:page:*");
    if (keys.length > 0) {
      await redis.del(keys);
      console.log("Order cache cleared");
    }

    let updatedOrder = {
      orderId: updated._id,
      newStatus: updated.status,
      updateAt: updated.updatedAt,
    };
    const io = req.app.get("io");
    io.emit("orderUpdated", updatedOrder);
    res.json({
      success: true,
      status: 200,
      message: "Order updated",
      order: updated,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get All ORDERS
export const getAllOrders = async (req: any, res: Response) => {
  try {
    let userId = req.user?.id;
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const redisKey = `orders:page:${page}:limit:${limit}`;

    const cachedOrders = await redis.get(redisKey);
    if (cachedOrders) {
      return res.status(200).json({
        message: "Orders fetched from cache",
        orders: JSON.parse(cachedOrders),
      });
    }
    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    await redis.set(redisKey, JSON.stringify(orders), {
      EX: 60 * 60,
    });

    const totalOrders = await Order.countDocuments();

    return res.json({
      success: true,
      page,
      limit,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      data: orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};
