/* ──────────────────────────────────────────────
   SHAS Jewellery — Type Definitions
   ────────────────────────────────────────────── */

export interface Product {
  id: string;
  name: string;
  material: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: 'Best Seller' | 'Handmade' | 'New' | 'Handcrafted';
  inStock: boolean;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  product: string;
  avatar?: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  caption: string;
  category: string;
  link?: string;
  tag?: string;
}

export interface GalleryCategory {
  id: string;
  label: string;
  value: string;
}

export interface FeaturedSpace {
  id: string;
  image: string;
  tag: string;
  caption: string;
  size: 'large' | 'small' | 'wide';
}

export interface StylingGuide {
  id: string;
  title: string;
  description: string;
  iconNumber: string;
  link: string;
}

export interface CustomerSpace {
  id: string;
  image: string;
  customerName: string;
  location: string;
  productName: string;
}

export interface Stat {
  value: string;
  label: string;
}

/* ── Shop Page Types ── */

export interface ShopProduct {
  id: string;
  name: string;
  category: string;
  material: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  usage: string;
  size: string;
  colorFinish: string;
  availability: 'In Stock' | 'Back in Stock' | 'Made to Order';
  inStock: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  title: string;
  type: 'checkbox' | 'chip' | 'color' | 'range';
  options: FilterOption[];
}

export interface SortOption {
  label: string;
  value: string;
}

export interface TrustItem {
  icon: string;
  title: string;
  description: string;
}
