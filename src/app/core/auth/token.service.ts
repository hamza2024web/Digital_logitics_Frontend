import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn : 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = environment.tokenKey;
  private readonly REFRESH_TOKEN_KEY = environment.refreshTokenKey;

  constructor() {}

  setAccessToken(token : string): void{
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  removeAccessToken(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY,token);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  removeRefreshToken(): void {
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
