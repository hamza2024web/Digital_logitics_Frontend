// src/app/api/services/product-api.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {Product, ProductCreateRequest, ProductQuery, ProductResponse} from '../models/product.model';

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
    const params = new HttpParams().set('active', active.toString());
    return this.http.patch<Product>(`${this.API_URL}/${id}/status`,null,{ params })
  }

  list(query : ProductQuery): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', query.page.toString())
      .set('size', query.size.toString())
      .set('active', query.active.toString());

    if (query.sort) params = params.set('sort', query.sort);
    if (query.search) params = params.set('size', query.search)
    if (query.category) params = params.set('category', query.category);

    return this.http.get<ProductResponse>(this.API_URL, { params });
  }
}
