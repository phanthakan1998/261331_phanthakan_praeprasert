import {
  CampaignCategory,
  CampaignType,
  ItemCategory,
} from "../enums/discount.enum";
import { CartItem } from "./cart.type";

export interface BaseCampaign {
  type: CampaignType;
  category: CampaignCategory;
}

export interface FixedAmountCampaign extends BaseCampaign {
  type: CampaignType.FIXED_AMOUNT;
  category: CampaignCategory.COUPON;
  amount: number;
}

export interface PercentageCampaign extends BaseCampaign {
  type: CampaignType.PERCENTAGE;
  category: CampaignCategory.COUPON;
  percentage: number;
}

export interface PercentageByCategoryCampaign extends BaseCampaign {
  type: CampaignType.PERCENTAGE_BY_CATEGORY;
  category: CampaignCategory.ON_TOP;
  itemCategory: ItemCategory;
  percentage: number;
}

export interface DiscountByPointsCampaign extends BaseCampaign {
  type: CampaignType.DISCOUNT_BY_POINTS;
  category: CampaignCategory.ON_TOP;
  points: number;
}

export interface SpecialCampaign extends BaseCampaign {
  type: CampaignType.SPECIAL_CAMPAIGNS;
  category: CampaignCategory.SEASONAL;
  everyAmount: number;
  discountAmount: number;
}

export type Campaign =
  | FixedAmountCampaign
  | PercentageCampaign
  | PercentageByCategoryCampaign
  | DiscountByPointsCampaign
  | SpecialCampaign;

export interface DiscountCalculationRequest {
  cartItems: CartItem[];
  campaigns: Campaign[];
}

export interface DiscountList {
  campaignType: CampaignType;
  category: CampaignCategory;
  description: string;
  discountAmount: number;
  priceBeforeDiscount: number;
  priceAfterDiscount: number;
}

export interface DiscountCalculationResult {
  originalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  discountList: DiscountList[];
  appliedCampaigns: Campaign[];
}

export interface DiscountCalculationByCartIdRequest {
  cartId: string;
  campaigns: Campaign[];
}
