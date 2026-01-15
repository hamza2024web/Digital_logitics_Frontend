export interface Product {
  id: number;
  sku: string;
  name: string;
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
