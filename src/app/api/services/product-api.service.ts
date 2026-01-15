// src/app/api/services/product-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductCreateRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/admin/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this. http.get<Product[]>(this.API_URL);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  createProduct(product: ProductCreateRequest): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  updateProduct(id: number, product:  Partial<ProductCreateRequest>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  toggleProductStatus(id: number, active: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/${id}/status`, { active });
  }
}
