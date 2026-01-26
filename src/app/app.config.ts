import {errorInterceptor} from './core/interceptors/error.interceptor';
import {refreshTokenInterceptor} from './core/interceptors/refresh-token.interceptor';
import {authInterceptor} from './core/interceptors/auth.interceptor';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {routes} from './app.routes';
import {provideRouter} from '@angular/router';
import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {provideEffects} from '@ngrx/effects';
import {provideStore} from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideEffects([]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
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
