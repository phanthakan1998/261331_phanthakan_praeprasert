import { Product } from "../entities/product";

export interface ProductRepository {
  findProductById(id: string): Promise<Product | null>;
  getAllProducts(): Promise<Product[]>;
}
