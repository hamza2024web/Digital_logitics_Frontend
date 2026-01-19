export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  supplierName: string;
  destinationWarehouseId: number;
  destinationWarehouseCode: string;
  status: PurchaseOrderStatus;
  createdAt: string;
  lines: PurchaseOrderLine[];
}

export interface PurchaseOrderLine {
  id: number;
  productId: number;
  productSku: string;
  quantityOrdered: number;
  quantityReserved: number;
  price: number;
}

export interface PurchaseOrderCreateRequest {
  supplierId: number;
  destinationWarehouseId: number;
  lines: PurchaseOrderCreateRequest[];
}

export interface PurchaseOrderLineCreateRequest {
  productId: number;
  quantity: number;
  price: number;
}
