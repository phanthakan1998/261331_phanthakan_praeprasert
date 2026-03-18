import Joi from "joi";

const cartItemSchema = Joi.object({
  productId: Joi.string().required(),
  name: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().positive().required(),
});

export const createCartSchema = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array().items(cartItemSchema).min(1).required(),
});

export const discountCalculateByCartSchema = Joi.object({
  cartId: Joi.string().required(),
  campaigns: Joi.array().min(1).required(),
});

export const idParamSchema = Joi.object({
  id: Joi.string().required(),
});
