// src/app/api/services/client-order-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SalesOrder, SalesOrderCreateRequest } from '../models/sales-order.model';

@Injectable({
  providedIn: 'root'
})
export class ClientOrderApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/client/orders`;

  constructor(private http: HttpClient) { }

  createOrder(order: SalesOrderCreateRequest): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(this.API_URL, order);
  }

  reserveOrderStock(orderId: number): Observable<SalesOrder> {
    return this.http.patch<SalesOrder>(`${this.API_URL}/${orderId}/reserve`, null);
  }

  getMyOrders(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.API_URL);
  }

  getOrderById(orderId: number): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.API_URL}/${orderId}`);
  }

}

