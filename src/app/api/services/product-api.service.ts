import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Product, ProductCreateRequest} from '../models/product.model';
import {Observable} from 'rxjs';

@Injectable ({
  providedIn : 'root'
})
export class ProductApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/admin/products`;

  constructor(private http:HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  createProduct(product: ProductCreateRequest): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
