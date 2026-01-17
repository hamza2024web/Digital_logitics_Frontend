import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Shipment, ShipmentCreateRequest} from '../models/shipment.model';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipmentApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/admin/sales-orders`;

  constructor(private http: HttpClient) {}

  createShipmentForOrder(orderId: number, shipment: ShipmentCreateRequest): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.API_URL}/${orderId}/shipments`, shipment);
  }

  shipOrder(orderId: number): Observable<Shipment> {
    return this.http.patch<Shipment>(`${this.API_URL}/${orderId}/ship`, null);
  }

  deliverOrder(orderId:  number): Observable<Shipment> {
    return this.http.patch<Shipment>(`${this.API_URL}/${orderId}/deliver`, null);
  }
}
