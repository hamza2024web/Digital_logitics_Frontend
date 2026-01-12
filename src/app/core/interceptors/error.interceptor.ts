import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req , next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erreur réseau : ${error.error.message}`;
      } else {
        switch (error.status) {
          case 401 :
            errorMessage = 'Non authentifié. veuillez vous connecter.';
            break;
          case 403 :
            errorMessage = 'Accès refusé.';
            router.navigate(['/403']);
            break;
          case 404 :
            errorMessage = 'Ressource non trouvé';
            break;
          case 409 :
            errorMessage = error.error?.message || 'Conflict de données.';
            break;
          case 500 :
            errorMessage = 'Erreur serveur interne.';
            break;
          default :
            errorMessage = error.error?.message || error.message;
        }
      }

      console.error('Erreur HTTP: ',error);

      return throwError(() => new Error(errorMessage));
    })
  )
}
