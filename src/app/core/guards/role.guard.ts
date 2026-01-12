import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as String[];

  if (!requiredRoles || requiredRoles.length === 0){
    return true;
  }

  const userRole = authService.getUserRole();

  if (requiredRoles.includes(userRole)) {
    return true;
  }

  console.warn(`Accès refusé: role ${userRole} non authorisé pour ${route.url}`);
  router.navigate(['/403']);
  return false;
};
