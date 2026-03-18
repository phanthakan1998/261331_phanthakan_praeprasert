import { Response, Request } from "express";
import productService from "../../services/product.service";
import loggerService from "../../services/logger.service";

export const getAllProducts = async (request: Request, response: Response) => {
  loggerService.start(request);
  const result = await productService.getAllProducts();
  response.status(result.status).send(result.data);
  loggerService.end(request);
};

export default getAllProducts;
