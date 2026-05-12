export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  price: number;
  imageFileName: string;
  categorySlug: string;
  categoryName: string;
  stock: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageFileName: string;
  categorySlug: string;
  categoryName: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type ProductSort = "newest" | "price_asc" | "price_desc" | "name_asc";

export interface ProductQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}
