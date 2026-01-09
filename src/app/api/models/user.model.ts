export interface User {
  email : string;
  role : 'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT';
}

export interface AuthResponse {
  token : string;
  refreshToken : string;
  email : string;
  role : 'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT';
}

export interface LoginRequest {
  email : string;
  password : string;
}

export interface RegisterRequest {
  firstName : string;
  lastName : string;
  email : string;
  password : string;
}

export interface RegisterResponse {
  firstName : string;
  lastName : string;
  email : string;
  role : 'CLIENT';
  active : boolean;
}

export interface RefreshTokenRequest {
  refreshToken : string;
}

export interface TokenPayload {
  sub : string; // Email de l'utilisateurs
  iat : number; // Date de création ( timestamp )
  exp : number; // Date d'expiration ( timestamp )
}
