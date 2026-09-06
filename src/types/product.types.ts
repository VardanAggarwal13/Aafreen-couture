export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface ICollection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  basePrice: number;       // paise
  comparePrice?: number;   // paise
  category: string | ICategory;
  collection?: string | ICollection;
  images: string[];
  variants?: IProductVariant[];
  tags: string[];
  occasion?: string[];
  fabric?: string;
  workType?: string;
  careInstructions?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProductVariant {
  _id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  material?: string;
  sku: string;
  price: number;         // paise
  comparePrice?: number; // paise
  stock: number;
  images: string[];
  isActive: boolean;
}

export interface IReview {
  _id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  isVerified: boolean;
  isApproved: boolean;
  adminReply?: string;
  user?: { name: string; avatar?: string };
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  size?: string;
  color?: string;
  price: number;    // paise
  quantity: number;
}
