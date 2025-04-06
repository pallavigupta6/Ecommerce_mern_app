export interface User {
  id: string;
  name: string;
  email?: string;
  mobileNumber: string;
  address?: string;
  dateOfBirth?: string;
  role: 'customer' | 'admin';
  token: string;
}

export interface Product {
  id: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'placed' | 'packed' | 'shipping' | 'delivered' | 'cancelled';
  total: number;
  couponDiscount?: number;
  gst: number;
  finalAmount: number;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minimumCartValue: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}