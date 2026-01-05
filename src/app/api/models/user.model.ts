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

export interface RefreshTokenRequest {
  refreshToken : string;
}

export interface TokenPayload {
  sub : string;
  iat : number;
  exp : number;
}
