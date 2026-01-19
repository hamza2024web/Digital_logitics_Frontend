import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Inventory, MovementRequest, AdjustmentRequest } from '../models/inventory.model';
import {PurchaseOrder} from '../models/purchse-order.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/warehouse-manager/inventory`;

  constructor(private http: HttpClient) {}

  recordInbound(purchaseOrderId: number): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.API_URL}/${purchaseOrderId}/inbound`, null);
  }

  recordOutbound(movement: MovementRequest): Observable<Inventory> {
    return this. http.post<Inventory>(`${this.API_URL}/outbound`, movement);
  }

  recordAdjustment(adjustment:  AdjustmentRequest): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.API_URL}/adjustment`, adjustment);
  }

  getAllInventories(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiBaseUrl}/api/warehouse-manager/inventories`);
  }

  getInventoriesByWarehouse(warehouseId: number): Observable<Inventory[]> {
    return this. http.get<Inventory[]>(`${environment.apiBaseUrl}/api/warehouse-manager/inventories/warehouse/${warehouseId}`);
  }
}
