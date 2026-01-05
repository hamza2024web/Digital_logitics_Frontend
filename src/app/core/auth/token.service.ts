import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn : 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = environment.tokenKey;
  private readonly REFRESH_TOKEN_KEY = environment.refreshTokenKey;

  constructor() {}

  // Sauvegarder l'access token dans session storage
  setAccessToken(token : string): void{
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  // Récupérer l'access token
  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Supprimer l'access token
  removeAccessToken(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }
}
