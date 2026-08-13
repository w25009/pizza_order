export type Language = 'en' | 'ja';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  avatar?: string;
  loyaltyPoints: number;
}

export type PizzaCategory = 'classic' | 'specialty' | 'vegetarian' | 'spicy';

export interface Pizza {
  id: string;
  name: {
    en: string;
    ja: string;
  };
  description: {
    en: string;
    ja: string;
  };
  price: number;
  image: string;
  category: PizzaCategory;
  inStock: boolean;
  rating: number;
  calories: number;
  ingredients: {
    en: string[];
    ja: string[];
  };
}

export type PizzaSize = 'S' | 'M' | 'L';
export type CrustType = 'thin' | 'pan' | 'stuffed';

export interface OrderItem {
  id: string;
  pizzaId: string;
  pizzaName: {
    en: string;
    ja: string;
  };
  image: string;
  size: PizzaSize;
  crust: CrustType;
  extraToppings: string[];
  count: number;
  pricePerUnit: number;
}

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'baking'
  | 'out_for_delivery'
  | 'ready_for_pickup'
  | 'delivered'
  | 'cancelled';

export type OrderType = 'delivery' | 'pickup';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  orderType: OrderType;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedMinutes: number;
  paymentMethod: 'card' | 'cash' | 'mobile_pay';
  notes?: string;
}

export interface AppNotification {
  id: string;
  title: {
    en: string;
    ja: string;
  };
  message: {
    en: string;
    ja: string;
  };
  timestamp: string;
  read: boolean;
  type: 'new_order' | 'status_change' | 'system';
  orderId?: string;
}
