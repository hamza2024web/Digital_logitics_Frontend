export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  image?:  string;
  price:  number;
  active: boolean;
}

export interface ProductCreateRequest {
  sku: string;
  name: string;
  image?: string;
  price:  number;
  active: boolean;
}

export interface ProductUpdateRequest {
  sku?: string;
  name?:  string;
  image?: string;
  price?: number;
  active?: boolean;
}

export interface ProductQuery {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  category?: string;
  active: boolean;
}

export interface ProductResponse {
  items: Product[];
  totalElements: number;
  totalPages: number;
}
