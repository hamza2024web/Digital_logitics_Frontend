import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Supplier, SupplierCreateRequest } from '../models/supplier.model';

@Injectable({
  providedIn:  'root'
})
export class SupplierApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/admin/suppliers`;

  constructor(private http: HttpClient) {}

  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.API_URL);
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.API_URL}/${id}`);
  }

  createSupplier(supplier: SupplierCreateRequest): Observable<Supplier> {
    return this.http.post<Supplier>(this.API_URL, supplier);
  }

  updateSupplier(id: number, supplier: SupplierCreateRequest): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.API_URL}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this. http.delete<void>(`${this.API_URL}/${id}`);
  }
}
