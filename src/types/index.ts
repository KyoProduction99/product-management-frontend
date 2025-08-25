export const orderStatuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Sports",
  "Other",
] as const;

export type CategoryType = (typeof categories)[number];

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  imagePath?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  name: string;
  email: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
