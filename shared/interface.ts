export interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export interface PaginationType {
  pages: number;
  page: number;
  keyword?: string;
  isAdmin?: boolean;
}
export interface ReviewItem {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt?: string;
}

export interface ProductItem {
  _id?: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  reviews?: ReviewItem[];
  user?: string;
  product?: string;
}
export interface CartItemType extends ProductItem {
  qty: number;
}
export interface InitialCartStateType {
  cartItems?: CartItemType[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  shippingAddress: ShippingAddresType;
  paymentMethod: string;
  isDelivered: boolean;
}
export interface OrderType extends InitialCartStateType {
  _id: string;
  createdAt: string;
  isPaid: boolean;
  paidAt: string;
  deliveredAt: string;
  user: { _id: string; name: string };
}

export interface UserType {
  name: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
  _id?: string;
}

export interface ShippingAddresType {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface StepsType {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}
