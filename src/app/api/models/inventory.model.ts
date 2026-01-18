export interface Inventory {
  id:  number;
  productId: number;
  productSku: string;
  warehouseId: number;
  warehouseCode: string;
  qtyOnHand: number;
  qtyReserved: number;
}

export interface InventoryWithAvailable extends Inventory {
  qtyAvailable: number;
}

export interface MovementRequest {
  productId: number;
  warehouseId: number;
  quantity: number;
}

export interface AdjustmentRequest {
  productId: number;
  warehouseId: number;
  quantity: number;
  reason: string;
}

export enum MovementType {
  INBOUND = 'INBOUND',       // Entrée de stock
  OUTBOUND = 'OUTBOUND',     // Sortie de stock
  ADJUSTMENT = 'ADJUSTMENT'  // Ajustement
}
