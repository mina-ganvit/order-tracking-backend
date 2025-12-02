import Joi from "joi";

export const createOrderValidation = Joi.object({
  userId: Joi.string().required().messages({
    "string.empty": "User ID is required",
    "any.required": "User ID is required",
  }),

  items: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          "string.empty": "Item name is required",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one item is required",
    }),

  totalAmount: Joi.number().min(0).required().messages({
    "number.base": "Total amount must be a number",
    "any.required": "Total amount is required",
  }),
});

export const updateOrderStatusValidation = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "delivered", "cancelled")
    .default("pending"),
});
