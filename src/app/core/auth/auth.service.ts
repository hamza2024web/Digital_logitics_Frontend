import {Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {
  AuthenticatedUser,
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  User
} from '../../api/models/user.model';
import {BehaviorSubject, catchError, Observable, Subscription, switchMap, tap, throwError, timer} from 'rxjs';
import {TokenService} from './token.service';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable ({
  providedIn : 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/auth`;

  private currentUserSubject = new BehaviorSubject<AuthenticatedUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public currentUserSignal = signal<AuthenticatedUser |  null>(null);

  private refreshTokenTimer ?: Subscription ;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.tokenService.getAccessToken();

    if (token && !this.tokenService.isTokenExpired(token)){
      const decoded = this.tokenService.decodeToken(token);

      const user : AuthenticatedUser = {
        email : decoded.sub,
        role : this.extractRoleFromToken(decoded)
      };
      this.setCurrentUser(user);
      this.startRefreshTokenTimer();
    } else {
      this.clearAuth();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(this.handleError)
      );
  }

  register(credentials : RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, credentials)
      .pipe(
        tap(response => this.handleRegisterSuccess(response)),
        catchError(this.handleRegisterError)
      );
  }

  private handleAuthSuccess(response : AuthResponse): void {
    this.tokenService.setAccessToken(response.token);
    this.tokenService.setRefreshToken(response.refreshToken);

    const user : AuthenticatedUser = {
      email : response.email,
      role : response.role
    };

    this.setCurrentUser(user);

    this.startRefreshTokenTimer();

    this.redirectAfterLogin(response.role);
  }

  private handleRegisterSuccess(response : RegisterResponse): void {
    console.log('✅ Inscription réussie:',response);

    setTimeout(() => {
      this.redirectToLogin();
    }, 1000);
  }

  private handleRegisterError(error : HttpErrorResponse) : Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      switch (error.status) {
        case 409 :
          errorMessage = 'Email Exist déjà';
          break;
        case 400 :
          errorMessage = 'Données Invalides';
          break;
        case 500 :
          errorMessage = 'Erreur serveur interne';
          break;
        default:
          errorMessage = error.error?.message || error.message;
      }
    }

    console.error('Erreur Auth : ', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  private clearAuth(): void {
    this.tokenService.clearTokens();
    this.setCurrentUser(null);
    this.stopRefreshTokenTimer();
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('Pas de refresh Token disponible'));
    }

    const request: RefreshTokenRequest = { refreshToken };

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, request)
      .pipe(
        tap(response => {
          this.tokenService.setAccessToken(response.token);
          this.tokenService.setRefreshToken(response.refreshToken);

          this.startRefreshTokenTimer();
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  private startRefreshTokenTimer(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) return ;

    const remainingTime = this.tokenService.getTokenRemainingTime(token);
    const refreshTime = remainingTime - (60 * 1000);

    if (refreshTime > 0){
      this.refreshTokenTimer = timer(refreshTime)
        .pipe(switchMap(() => this.refreshToken()))
        .subscribe({
          error: () => this.logout()
        });
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimer) {
      this.refreshTokenTimer.unsubscribe();
    }
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getAccessToken();
    return token !== null && !this.tokenService.isTokenExpired(token);
  }

  getUserRole(): string {
    return this.currentUserSubject.value?.role || '';
  }

  getUserEmail(): string {
    return this.currentUserSubject.value?.email ||'';
  }

  getCurrentUser() : AuthenticatedUser | null {
    return this.currentUserSubject.value;
  }

  private setCurrentUser(user:AuthenticatedUser | null): void {
    this.currentUserSubject.next(user);
    this.currentUserSignal.set(user);
  }

  private extractRoleFromToken(decoded : any): 'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT' {
    if (decoded.role){
      return decoded.role;
    }

    if (decoded.authorities && Array.isArray(decoded.authorities)) {
      const role = decoded.authorities[0];
      return role.replace('ROLE_','') as any;
    }

    return 'CLIENT';
  }

  private redirectAfterLogin(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'WAREHOUSE_MANAGER':
        this.router.navigate(['/warehouse/dashboard']);
        break;
      case 'CLIENT':
        this.router.navigate(['/client/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  private redirectToLogin() : void {
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401 :
          errorMessage = 'Email ou mot de passe incorrect';
          break;
        case 403 :
          errorMessage = 'Accès refusé'
          break;
        case 500 :
          errorMessage = 'Erreur serveur interne';
          break;
        default:
          errorMessage = error.error?.message || error.message;
      }
    }

    console.error('Erreur Auth : ', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
