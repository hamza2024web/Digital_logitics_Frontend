import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Warehouse, WarehouseCreateRequest } from '../models/warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/admin/warehouses`;

  constructor(private http: HttpClient) {}

  getAllWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.API_URL);
  }

  getWarehouseById(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.API_URL}/${id}`);
  }

  createWarehouse(warehouse:  WarehouseCreateRequest): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.API_URL, warehouse);
  }

  updateWarehouse(id: number, warehouse: WarehouseCreateRequest): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.API_URL}/${id}`, warehouse);
  }

  deleteWarehouse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
