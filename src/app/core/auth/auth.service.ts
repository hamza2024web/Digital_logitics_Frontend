import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {User} from '../../api/models/user.model';
import {BehaviorSubject} from 'rxjs';

@Injectable ({
  providedIn : 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


}
