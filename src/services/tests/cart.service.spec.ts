import { getCartById, createCart, getAllCarts } from "../cart.service";
import { MockCartRepository } from "../../infrastructure/repositories/cart.repository";
import { HTTP_RESPONSE_CODE } from "../../infrastructure/common/enums/response.enum";

describe("Cart Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCartById", () => {
    it("should return cart when found", async () => {
      const mockCart = { id: "1", items: [] };

      jest
        .spyOn(MockCartRepository.prototype, "findById")
        .mockResolvedValue(mockCart as any);

      const result = await getCartById("1");

      expect(result.status).toBe(HTTP_RESPONSE_CODE.OK);
      expect(result.data).toEqual(mockCart);
    });

    it("should return NOT_FOUND when cart does not exist", async () => {
      jest
        .spyOn(MockCartRepository.prototype, "findById")
        .mockResolvedValue(null);

      const result = await getCartById("1");

      expect(result.status).toBe(HTTP_RESPONSE_CODE.NOT_FOUND);
      expect(result.data).toBeNull();
    });

    it("should return INTERNAL_SERVER_ERROR on exception", async () => {
      jest
        .spyOn(MockCartRepository.prototype, "findById")
        .mockRejectedValue(new Error("DB error"));

      const result = await getCartById("1");

      expect(result.status).toBe(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR);
      expect(result.data).toBeNull();
    });
  });

  describe("createCart", () => {
    it("should create cart successfully", async () => {
      const request = { items: [] };
      const mockCart = { id: "1", items: [] };

      jest
        .spyOn(MockCartRepository.prototype, "create")
        .mockResolvedValue(mockCart as any);

      const result = await createCart(request as any);

      expect(result.status).toBe(HTTP_RESPONSE_CODE.CREATED);
      expect(result.data).toEqual(mockCart);
    });

    it("should return INTERNAL_SERVER_ERROR on failure", async () => {
      const error = new Error("Create failed");

      jest
        .spyOn(MockCartRepository.prototype, "create")
        .mockRejectedValue(error);

      const result = await createCart({ items: [] } as any);

      expect(result.status).toBe(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR);
      expect(result.data).toBe(error);
    });
  });

  describe("getAllCarts", () => {
    it("should return all carts", async () => {
      const mockCarts = [{ id: "1" }, { id: "2" }];

      jest
        .spyOn(MockCartRepository.prototype, "getAllCarts")
        .mockResolvedValue(mockCarts as any);

      const result = await getAllCarts();

      expect(result.status).toBe(HTTP_RESPONSE_CODE.OK);
      expect(result.data).toEqual(mockCarts);
    });

    it("should return empty array on error", async () => {
      jest
        .spyOn(MockCartRepository.prototype, "getAllCarts")
        .mockRejectedValue(new Error("DB error"));

      const result = await getAllCarts();

      expect(result.status).toBe(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR);
      expect(result.data).toEqual([]);
    });
  });
});
