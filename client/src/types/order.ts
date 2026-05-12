export interface OrderItem {
  productId: number;
  productName: string;
  productSlug: string;
  imageFileName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  customerName: string;
  email: string;
  shippingAddress: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  customerName: string;
  email: string;
  shippingAddress: string;
  items: { productId: number; quantity: number }[];
}
