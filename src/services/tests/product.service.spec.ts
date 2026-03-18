import { getAllProducts } from "../product.service";
import { MockProductRepository } from "../../infrastructure/repositories/product.repository";
import { HTTP_RESPONSE_CODE } from "../../infrastructure/common/enums/response.enum";

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return products successfully", async () => {
      const mockProducts = [
        { id: "1", name: "Laptop", price: 1000 },
        { id: "2", name: "Phone", price: 500 },
      ];

      jest
        .spyOn(MockProductRepository.prototype, "getAllProducts")
        .mockResolvedValue(mockProducts as any);

      const result = await getAllProducts();

      expect(result.status).toBe(HTTP_RESPONSE_CODE.OK);
      expect(result.data).toEqual(mockProducts);
    });

    it("should return INTERNAL_SERVER_ERROR when repository throws", async () => {
      const error = new Error("DB error");

      jest
        .spyOn(MockProductRepository.prototype, "getAllProducts")
        .mockRejectedValue(error);

      const result = await getAllProducts();

      expect(result.status).toBe(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR);
      expect(result.data).toBe(error);
    });
  });
});
