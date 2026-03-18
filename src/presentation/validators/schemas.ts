import Joi from "joi";
import {
  CampaignType,
  CampaignCategory,
  ItemCategory,
} from "../../infrastructure/common/enums/discount.enum";

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

const fixedAmountSchema = Joi.object({
  type: Joi.string().valid(CampaignType.FIXED_AMOUNT).required(),
  category: Joi.string().valid(CampaignCategory.COUPON).required(),
  amount: Joi.number().positive().required(),
});

const percentageSchema = Joi.object({
  type: Joi.string().valid(CampaignType.PERCENTAGE).required(),
  category: Joi.string().valid(CampaignCategory.COUPON).required(),
  percentage: Joi.number().min(0).max(100).required(),
});

const percentageByCategorySchema = Joi.object({
  type: Joi.string().valid(CampaignType.PERCENTAGE_BY_CATEGORY).required(),
  category: Joi.string().valid(CampaignCategory.ON_TOP).required(),
  itemCategory: Joi.string()
    .valid(...Object.values(ItemCategory))
    .required(),
  percentage: Joi.number().min(0).max(100).required(),
});

const discountByPointsSchema = Joi.object({
  type: Joi.string().valid(CampaignType.DISCOUNT_BY_POINTS).required(),
  category: Joi.string().valid(CampaignCategory.ON_TOP).required(),
  points: Joi.number().integer().positive().required(),
});

const specialCampaignSchema = Joi.object({
  type: Joi.string().valid(CampaignType.SPECIAL_CAMPAIGNS).required(),
  category: Joi.string().valid(CampaignCategory.SEASONAL).required(),
  everyAmount: Joi.number().positive().required(),
  discountAmount: Joi.number().positive().required(),
});

export const discountCalculateByCartSchema = Joi.object({
  cartId: Joi.string().required(),
  campaigns: Joi.array().min(1).required(),
});

export const idParamSchema = Joi.object({
  id: Joi.string().required(),
});
