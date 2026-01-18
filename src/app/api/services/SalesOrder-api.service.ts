// src/app/api/services/sales-order-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {SalesOrder} from '../models/sales-order.model';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/admin/sales-orders`;

  constructor(private http: HttpClient) {}

  getAllSalesOrders(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.API_URL);
  }

  getSalesOrderById(id: number): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.API_URL}/${id}`);
  }
}
