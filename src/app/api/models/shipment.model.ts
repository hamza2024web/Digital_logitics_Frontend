export enum ShipmentStatus {
  PLANNED = 'PLANNED',         // Planifié
  IN_TRANSIT = 'IN_TRANSIT',   // En transit
  DELIVERED = 'DELIVERED',     // Livré
  CANCELLED = 'CANCELLED'      // Annulé
}

export interface Shipment {
  id: number;
  trackingNumber: string;
  carrier: string; // Add carrier to model
  status: ShipmentStatus;
  creationDate: string;  // ISO date string
  lastUpdatedDate: string;  // ISO date string
}

export interface ShipmentCreateRequest {
  trackingNumber: string;
}
