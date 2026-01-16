import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {PurchaseOrder, PurchaseOrderCreateRequest} from '../models/purchse-order.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/admin/purchase-orders`;

  constructor(private http: HttpClient) {}

  getAllPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this. API_URL);
  }

  getPurchaseOrderById(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.API_URL}/${id}`);
  }

  createPurchaseOrder(order: PurchaseOrderCreateRequest): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(this. API_URL, order);
  }

  sendPurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this. http.patch<PurchaseOrder>(`${this.API_URL}/${id}/send`, null);
  }

  cancelPurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this.http.patch<PurchaseOrder>(`${this.API_URL}/${id}/cancel`, null);
  }
}
