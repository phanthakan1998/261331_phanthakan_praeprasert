import { Product } from "../domain/entities/product";
import { HTTP_RESPONSE_CODE } from "../infrastructure/common/enums/response.enum";
import { ResponseCommonType } from "../infrastructure/common/types/response-common.type";
import { MockProductRepository } from "../infrastructure/repositories/product.repository";

const productRepository = new MockProductRepository();

export const getAllProducts = async (): Promise<
  ResponseCommonType<Product[] | Error>
> => {
  try {
    const result = await productRepository.getAllProducts();
    return {
      status: HTTP_RESPONSE_CODE.OK,
      data: result,
    };
  } catch (error) {
    return {
      status: HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      data: error as Error,
    };
  }
};

export default {
  getAllProducts,
};
