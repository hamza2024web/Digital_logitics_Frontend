export interface Warehouse {
  id: number;
  code: string;
  name: string;
}

export interface WarehouseCreateRequest {
  code: string;
  name: string;
}
