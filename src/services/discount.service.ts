import {
  CampaignCategory,
  CampaignType,
} from "../infrastructure/common/enums/discount.enum";
import { HTTP_RESPONSE_CODE } from "../infrastructure/common/enums/response.enum";
import { CartItem } from "../infrastructure/common/types/cart.type";
import {
  Campaign,
  DiscountCalculationResult,
  DiscountList,
  DiscountCalculationByCartIdRequest,
} from "../infrastructure/common/types/discount.type";
import { ResponseCommonType } from "../infrastructure/common/types/response-common.type";
import cartService from "./cart.service";

const POINTS_TO_THB = 1;
const MAX_POINTS_CAP = 0.2;

const getCartTotal = (items: CartItem[]): number => {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
};

const getCategoryTotal = (items: CartItem[], category: string): number => {
  let total = 0;
  for (const item of items) {
    if (item.category.toLowerCase() === category.toLowerCase()) {
      total += item.price * item.quantity;
    }
  }
  return total;
};

const groupCampaigns = (campaigns: Campaign[]): Record<string, Campaign> => {
  const campaignList: Record<string, Campaign> = {};

  for (const campaign of campaigns) {
    if (campaignList[campaign.category]) {
      throw new Error(`Duplicate category: ${campaign.category}`);
    }
    campaignList[campaign.category] = campaign;
  }

  return campaignList;
};

const applyDiscount = (
  price: number,
  items: CartItem[],
  campaign: Campaign,
): { discount: number; newPrice: number; description: string } => {
  let discount = 0;
  let description = "";

  switch (campaign.type) {
    case CampaignType.FIXED_AMOUNT:
      discount = Math.min(campaign.amount, price);
      description = `Fixed: ${campaign.amount} THB off`;
      break;

    case CampaignType.PERCENTAGE:
      discount = (price * campaign.percentage) / 100;
      description = `${campaign.percentage}% off`;
      break;

    case CampaignType.PERCENTAGE_BY_CATEGORY:
      const categoryTotal = getCategoryTotal(items, campaign.itemCategory);
      discount = (categoryTotal * campaign.percentage) / 100;
      description = `${campaign.percentage}% off ${campaign.itemCategory}`;
      break;

    case CampaignType.DISCOUNT_BY_POINTS:
      const maxDiscount = price * MAX_POINTS_CAP;
      const pointsValue = campaign.points * POINTS_TO_THB;
      discount = Math.min(pointsValue, maxDiscount);
      description = `${campaign.points} points used (max ${maxDiscount} THB)`;
      break;

    case CampaignType.SPECIAL_CAMPAIGNS:
      const times = Math.floor(price / campaign.everyAmount);
      discount = times * campaign.discountAmount;
      description = `${campaign.discountAmount} THB off per ${campaign.everyAmount} THB (x${times})`;
      break;

    default:
      throw new Error("Unknown campaign type");
  }

  return {
    discount,
    newPrice: price - discount,
    description,
  };
};

const calculate = (
  items: CartItem[],
  campaigns: Campaign[],
): DiscountCalculationResult => {
  const grouped = groupCampaigns(campaigns);

  let currentPrice = getCartTotal(items);
  const originalPrice = currentPrice;
  const discountList: DiscountList[] = [];
  const applied: Campaign[] = [];

  const order = [
    CampaignCategory.COUPON,
    CampaignCategory.ON_TOP,
    CampaignCategory.SEASONAL,
  ];

  for (const category of order) {
    const campaign = grouped[category];
    if (!campaign) continue;

    const priceBefore = currentPrice;
    const result = applyDiscount(currentPrice, items, campaign);
    currentPrice = result.newPrice;

    discountList.push({
      campaignType: campaign.type,
      category: campaign.category,
      description: result.description,
      discountAmount: result.discount,
      priceBeforeDiscount: priceBefore,
      priceAfterDiscount: currentPrice,
    });

    applied.push(campaign);
  }

  return {
    originalPrice,
    totalDiscount: originalPrice - currentPrice,
    finalPrice: Math.max(0, currentPrice),
    discountList,
    appliedCampaigns: applied,
  };
};

export const calculateDiscountByCartId = async (
  req: DiscountCalculationByCartIdRequest,
): Promise<ResponseCommonType<DiscountCalculationResult | null>> => {
  const cart = await cartService.getCartById(req.cartId);

  if (!cart || !cart.data) {
    throw new Error(`Cart not found: ${req.cartId}`);
  }

  if (!cart.data.items || cart.data.items.length === 0) {
    return { status: HTTP_RESPONSE_CODE.OK, data: null };
  }

  const result = calculate(cart.data.items, req.campaigns);

  return { status: HTTP_RESPONSE_CODE.OK, data: result };
};

export default {
  calculateDiscountByCartId,
};
