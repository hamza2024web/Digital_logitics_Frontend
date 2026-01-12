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

  hasToken(): boolean {
    return this.getAccessToken() !== null;
  }

  decodeToken(token : string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Erreur décodage token : ', error);
      return null;
    }
  }

  isTokenExpired(token : string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp){
      return true;
    }

    const expirationDate = new Date(decoded.exp * 1000);
    const now = new Date();

    return expirationDate < now;
  }

  getTokenRemainingTime(token : string): number {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp){
      return 0;
    }

    const expirationDate = new Date(decoded.exp * 1000);
    const now = new Date();

    return Math.max(0, expirationDate.getTime() - now.getTime());
  }

  clearTokens(): void{
    this.removeAccessToken();
    this.removeRefreshToken();
  }
}
