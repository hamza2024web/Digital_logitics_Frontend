import { Shipment } from './shipment.model';

export enum SalesOrderStatus {
  PENDING = 'PENDING',         // En attente
  RESERVED = 'RESERVED',       // Stock réservé
  SHIPPED = 'SHIPPED',         // Expédié
  DELIVERED = 'DELIVERED',     // Livré
  CANCELLED = 'CANCELLED'      // Annulé
}

export enum SalesOrderLineStatus {
  PENDING = 'PENDING',
  RESERVED = 'RESERVED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface SalesOrder {
  id: number;
  clientId: number;
  clientUsername: string;
  warehouseId: number;
  warehouseCode: string;
  status: SalesOrderStatus;
  createdAt:  string;
  lines:  SalesOrderLine[];
  shipment?: Shipment;  // Optionnel (présent si expédition créée)
}
export interface SalesOrderLine {
  id:  number;
  productId: number;
  productSku: string;
  quantity: number;
  price: number;
  status: SalesOrderLineStatus;
}

