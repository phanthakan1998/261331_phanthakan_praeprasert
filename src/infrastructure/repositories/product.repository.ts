import { Product } from "../../domain/entities/product";
import { ProductRepository } from "../../domain/repositories/product.repository";

const productsData = require("../../mock-data/products.json");

export class MockProductRepository implements ProductRepository {
  private products: Product[] = productsData.products;

  async findProductById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) || null;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.products;
  }
}
