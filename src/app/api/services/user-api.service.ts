import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AdminUserCreateDTO, User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/users`;

  constructor(private http:HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  createUser(user: AdminUserCreateDTO): Observable<User> {
    return this.http.post<User>(this.API_URL, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  updateUserStatus(id: number, isActive: boolean): Observable<User> {
    const params = new HttpParams().set('isActive', isActive.toString());
    return this.http.patch<User>(`${this.API_URL}/${id}/status`,null, { params });
  }

}
