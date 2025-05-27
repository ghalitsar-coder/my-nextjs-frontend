// Types for Product Detail components

export interface Product {
  id: string;
  name: string;
  price: number;
  sizes: ProductSize[];
  grindOptions: GrindOption[];
  description: string;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  stockCount: number;
  attributes: ProductAttributes;
  detailedDescription: string[];
  sustainability: string;
  tastingNotes: string[];
}

export interface ProductSize {
  id: number;
  name: string;
  price: number;
  default?: boolean;
}

export interface GrindOption {
  id: number;
  name: string;
  default?: boolean;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

export interface ProductAttributes {
  region: string;
  altitude: string;
  process: string;
  varietal: string;
  roastLevel: string;
  bestFor: string;
  [key: string]: string; // Allow for additional attributes
}

export interface RelatedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: ProductSize;
  selectedGrind: GrindOption;
}
