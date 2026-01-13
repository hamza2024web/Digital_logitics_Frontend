import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateUserRequest, UpdateUserRequest, User} from '../models/user.model';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/users`;

  constructor(private http:HttpClient) {}

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.API_URL, user);
  }

  updateUser(id: number, user: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`,user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  toggleUserStatus(id: number, active: boolean): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${id}/status`, { active });
  }

}
