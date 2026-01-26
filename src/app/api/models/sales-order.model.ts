import { Shipment } from './shipment.model';

export enum SalesOrderStatus {
  CREATED = 'CREATED',                         // Créée
  PARTIALLY_RESERVED = 'PARTIALLY_RESERVED',   // Partiellement réservée
  RESERVED = 'RESERVED',                       // Réservée
  AWAITING_SHIPMENT = 'AWAITING_SHIPMENT',     // En attente d'expédition
  SHIPPED = 'SHIPPED',                         // Expédiée
  DELIVERED = 'DELIVERED',                     // Livrée
  CANCELLED = 'CANCELLED'                      // Annulée
}

export enum SalesOrderLineStatus {
  CREATED = 'CREATED',               // Créée
  RESERVED = 'RESERVED',             // Réservée
  BACKORDERED = 'BACKORDERED',       // En rupture
  AWAITING_TRANSFER = 'AWAITING_TRANSFER'  // En attente de transfert
}

export interface SalesOrder {
  id: number;
  clientId: number;
  clientUsername: string;
  warehouseId: number;
  warehouseCode: string;
  status: SalesOrderStatus;
  createdAt: string;
  lines: SalesOrderLine[];
  shipment?: Shipment;
}

export interface SalesOrderLine {
  id: number;
  productId: number;
  productSku: string;
  quantity:  number;
  price: number;
  status: SalesOrderLineStatus;
}

export interface SalesOrderCreateRequest {
  warehouseId: number;
  lines: SalesOrderLineCreateRequest[];
}

export interface SalesOrderLineCreateRequest {
  productId: number;
  quantity: number;
}
