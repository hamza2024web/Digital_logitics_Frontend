import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {SalesOrder} from '../models/sales-order.model';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/admin/sales-orders`;

  constructor(private http: HttpClient) { }

  getAllSalesOrders(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.API_URL);
  }

  getSalesOrderById(id: number): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.API_URL}/${id}`);
  }
}
