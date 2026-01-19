import { MovementType } from './inventory.model';

export interface InventoryMovement {
    productId: number;
    productSku: string;
    warehouseId: number;
    warehouseCode: string;
    type: MovementType;
    qty: number;
    occurredAt: string;
}
