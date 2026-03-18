import { Response, Request } from "express";
import productService from "../../services/product.service";

export const getAllProducts = async (_: Request, response: Response) => {
  const result = await productService.getAllProducts();
  response.status(result.status).send(result.data);
};

export default getAllProducts;
