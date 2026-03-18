// Campaign Categories
export enum CampaignCategory {
  COUPON = "COUPON",
  ON_TOP = "ON_TOP",
  SEASONAL = "SEASONAL",
}

// Campaign Types
export enum CampaignType {
  // Coupon category
  FIXED_AMOUNT = "FIXED_AMOUNT",
  PERCENTAGE = "PERCENTAGE",
  // On Top category
  PERCENTAGE_BY_CATEGORY = "PERCENTAGE_BY_CATEGORY",
  DISCOUNT_BY_POINTS = "DISCOUNT_BY_POINTS",
  // Seasonal category
  SPECIAL_CAMPAIGNS = "SPECIAL_CAMPAIGNS",
}

// Item categories for percentage by category discount
export enum ItemCategory {
  CLOTHING = "Clothing",
  ACCESSORIES = "Accessories",
  ELECTRONICS = "Electronics",
}
