import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenService} from '../auth/token.service';

export const authInterceptor : HttpInterceptorFn = (req , next) => {
  const tokenService = inject(TokenService);

  const publicUrls = ['/api/auth/login','/api/auth/register','/api/auth/refresh'];
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  if (isPublicUrl) {
    return next(req);
  }

  const token = tokenService.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization : `Bearer ${token}`
      }
    });
  }

  return next(req);
}
