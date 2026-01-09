import {errorInterceptor} from './core/interceptors/error.interceptor';
import {refreshTokenInterceptor} from './core/interceptors/refresh-token.interceptor';
import {authInterceptor} from './core/interceptors/auth.interceptor';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {routes} from './app.routes';
import {provideRouter} from '@angular/router';
import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        refreshTokenInterceptor,
        errorInterceptor
      ])
    )
  ]
};
