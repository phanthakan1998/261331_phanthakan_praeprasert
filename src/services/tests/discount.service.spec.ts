import {
  CampaignCategory,
  CampaignType,
} from "../../infrastructure/common/enums/discount.enum";
import cartService from "../cart.service";
import { calculateDiscountByCartId } from "../discount.service";

jest.mock("../cart.service");

const mockCartService = cartService as jest.Mocked<typeof cartService>;

describe("Discount Service", () => {
  const mockItems = [
    { price: 100, quantity: 2, category: "category1" },
    { price: 50, quantity: 1, category: "category2" },
  ];

  const baseCampaign = {
    category: CampaignCategory.COUPON,
    type: CampaignType.FIXED_AMOUNT,
    amount: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("calculateDiscountByCartId", () => {
    it("should return null if cart is empty", async () => {
      mockCartService.getCartById.mockResolvedValue({
        data: { items: [] },
      } as any);

      const result = await calculateDiscountByCartId({
        cartId: "1",
        campaigns: [],
      });

      expect(result.data).toBeNull();
    });

    it("should throw error if cart not found", async () => {
      mockCartService.getCartById.mockResolvedValue(null as any);

      await expect(
        calculateDiscountByCartId({
          cartId: "1",
          campaigns: [],
        }),
      ).rejects.toThrow("Cart not found");
    });

    it("should apply fixed discount correctly", async () => {
      mockCartService.getCartById.mockResolvedValue({
        data: { items: mockItems },
      } as any);

      const result = await calculateDiscountByCartId({
        cartId: "1",
        campaigns: [baseCampaign as any],
      });

      expect(result.data?.originalPrice).toBe(250);
      expect(result.data?.totalDiscount).toBe(50);
      expect(result.data?.finalPrice).toBe(200);
    });

    it("should apply percentage discount", async () => {
      mockCartService.getCartById.mockResolvedValue({
        data: { items: mockItems },
      } as any);

      const campaign = {
        category: CampaignCategory.COUPON,
        type: CampaignType.PERCENTAGE,
        percentage: 10,
      };

      const result = await calculateDiscountByCartId({
        cartId: "1",
        campaigns: [campaign as any],
      });

      expect(result.data?.totalDiscount).toBe(25);
      expect(result.data?.finalPrice).toBe(225);
    });

    it("should apply category percentage discount", async () => {
      mockCartService.getCartById.mockResolvedValue({
        data: { items: mockItems },
      } as any);

      const campaign = {
        category: CampaignCategory.COUPON,
        type: CampaignType.PERCENTAGE_BY_CATEGORY,
        percentage: 10,
        itemCategory: "category1",
      };

      const result = await calculateDiscountByCartId({
        cartId: "1",
        campaigns: [campaign as any],
      });

      expect(result.data?.totalDiscount).toBe(20);
      expect(result.data?.finalPrice).toBe(230);
    });

    it("should apply points discount with cap", async () => {
      mockCartService.getCartById.mockResolvedValue({
        data: { items: mockItems },
      } as any);

      const campaign = {
        category: CampaignCategory.COUPON,
        type: CampaignType.DISCOUNT_BY_POINTS,
        points: 1000,
      };

      const result = await calculateDiscountByCartId({
        cartId: "1",
        campaigns: [campaign as any],
      });

      expect(result.data?.totalDiscount).toBe(50);
      expect(result.data?.finalPrice).toBe(200);
    });

    it("should apply special campaign correctly", async () => {
      mockCartService.getCartById.mockResolvedValue({
        data: { items: mockItems },
      } as any);

      const campaign = {
        category: CampaignCategory.COUPON,
        type: CampaignType.SPECIAL_CAMPAIGNS,
        everyAmount: 100,
        discountAmount: 10,
      };

      const result = await calculateDiscountByCartId({
        cartId: "1",
        campaigns: [campaign as any],
      });

      expect(result.data?.totalDiscount).toBe(20);
      expect(result.data?.finalPrice).toBe(230);
    });

    it("should apply multiple campaign categories in order", async () => {
      mockCartService.getCartById.mockResolvedValue({
        data: { items: mockItems },
      } as any);

      const campaigns = [
        {
          category: CampaignCategory.COUPON,
          type: CampaignType.FIXED_AMOUNT,
          amount: 50,
        },
        {
          category: CampaignCategory.ON_TOP,
          type: CampaignType.PERCENTAGE,
          percentage: 10,
        },
      ];

      const result = await calculateDiscountByCartId({
        cartId: "1",
        campaigns: campaigns as any,
      });

      expect(result.data?.finalPrice).toBe(180);
    });

    it("should not allow duplicate campaign categories", async () => {
      mockCartService.getCartById.mockResolvedValue({
        data: { items: mockItems },
      } as any);

      const campaigns = [
        {
          category: CampaignCategory.COUPON,
          type: CampaignType.FIXED_AMOUNT,
          amount: 10,
        },
        {
          category: CampaignCategory.COUPON,
          type: CampaignType.PERCENTAGE,
          percentage: 10,
        },
      ];

      await expect(
        calculateDiscountByCartId({
          cartId: "1",
          campaigns: campaigns as any,
        }),
      ).rejects.toThrow("Duplicate category");
    });
  });
});
