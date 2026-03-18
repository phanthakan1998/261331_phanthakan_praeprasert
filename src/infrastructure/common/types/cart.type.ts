export interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCartItemRequest {
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface CreateCartRequest {
  userId: string;
  items: CreateCartItemRequest[];
}
