export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';
export type UserSpace = 'buyer' | 'seller' | 'admin';
export type AppLanguage = 'fr' | 'ht' | 'en';
export type AppTheme = 'light' | 'dark' | 'system';
export type AppCurrency = 'HTG' | 'USD';
export type DeliveryType = 'HOME_DELIVERY' | 'PICKUP_POINT';

export interface PickupPoint {
  id: string;
  name: string;
  department: string;
  city: string;
  address: string;
  landmark: string;
  openingHours: string;
  phone: string;
  feeHTG: number;
}

export interface ChatMessage {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  sender: 'BUYER' | 'SELLER';
  senderName: string;
  text: string;
  timestamp: string;
  productId?: string;
  productName?: string;
}

export interface AppNotification {
  id: string;
  type: 'ORDER' | 'PAYMENT' | 'SMS' | 'PROMO' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  orderId?: string;
  link?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  activeSpace: 'BUYER' | 'SELLER' | 'ADMIN';
  avatar?: string;
  isVerified: boolean;
  city: string;
  address?: string;
  createdAt: string;
  storeId?: string;
}

export interface Store {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  slogan: string;
  description: string;
  category: string;
  logo: string;
  banner: string;
  rating: number;
  reviewsCount: number;
  followersCount: number;
  isVerified: boolean;
  phone: string;
  city: string;
  address: string;
  monCashNumber: string;
  natCashNumber: string;
  subscriptionPlan: 'FREE' | 'PRO' | 'ENTERPRISE';
  isFeatured: boolean;
  totalSalesHTG: number;
  ordersCount: number;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[]; // e.g. ["Noir", "Bleu"] or ["S", "M", "L", "XL"]
  priceModifier?: number;
}

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  storeCity: string;
  storeVerified: boolean;
  name: string;
  description: string;
  price: number; // in HTG
  comparePrice?: number;
  category: string;
  images: string[];
  variants?: ProductVariant[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type PaymentMethodType = 'MONCASH' | 'NATCASH' | 'CASH_ON_DELIVERY';
export type PaymentStatusType = 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';
export type OrderStatusType = 
  | 'CREATED'
  | 'PAID'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'IN_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderTimelineEvent {
  status: OrderStatusType;
  timestamp: string;
  note: string;
  performedBy?: string;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  secondaryPhone?: string;
  city: string; // Port-au-Prince, Pétion-Ville, Delmas, Cap-Haïtien, etc.
  street: string;
  department: string; // Ouest, Nord, Sud, Artibonite, etc.
  deliveryNotes?: string;
  deliveryType?: DeliveryType;
  pickupPointId?: string;
  pickupPointName?: string;
  pickupPointAddress?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number; // HTG
  quantity: number;
  selectedVariant?: string;
  storeId: string;
}

export interface OrderReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  authorName: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. MG-2026-8941
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  subtotalHTG: number;
  deliveryFeeHTG: number;
  serviceFeeHTG: number;
  totalAmountHTG: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  paymentReference?: string;
  orderStatus: OrderStatusType;
  timeline: OrderTimelineEvent[];
  escrowPin?: string;
  review?: OrderReview;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amountHTG: number;
  method: PaymentMethodType;
  status: PaymentStatusType;
  senderPhone: string;
  transactionRef: string;
  operatorRef?: string;
  createdAt: string;
  confirmedAt?: string;
  logs: string[];
}

export interface PlatformConfig {
  marketplaceCommissionPercent: number;
  proSubscriptionPriceHTG: number;
  featuredProductPriceHTG: number;
  featuredStorePriceHTG: number;
  baseDeliveryFeeHTG: number;
  supportPhone: string;
  supportEmail: string;
  monCashSandbox: boolean;
  natCashSandbox: boolean;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface ReportItem {
  id: string;
  reporterName: string;
  reporterPhone: string;
  targetType: 'PRODUCT' | 'STORE' | 'ORDER' | 'USER';
  targetId: string;
  targetTitle: string;
  reason: string;
  details: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface Category {
  id: string;
  nameFr: string;
  nameHt: string;
  nameEn: string;
  icon: string;
  itemCount: number;
  bannerImage: string;
}
