import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path : 'dashboard',
    loadComponent: () => import('./dashboard/admin-dashboard/admin-dashboard')
      .then(m => m.AdminDashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/user-list/user-list')
      .then(m => m.UserList)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
