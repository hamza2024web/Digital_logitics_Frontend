import { Routes } from '@angular/router';
import {authGuard} from './core/guards/auth.guard';
import {roleGuard} from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'client',
    canActivate: [authGuard, roleGuard],
    data : {roles: ['CLIENT']},
    children: [
      {
        path : 'dashboard',
        loadComponent: () => import('./features/client/dashboard/client-dashboard/client-dashboard')
          .then(m => m.ClientDashboardComponent)
      },
      {path: '', redirectTo: 'dashboard', pathMatch : 'full'}
    ]
  },
  {
    path: 'warehouse',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['WAREHOUSE_MANAGER'] },
    children:  [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/warehouse/dashboard/warehouse-dashboard/warehouse-dashboard')
          .then(m => m.WarehouseDashboardComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch:  'full' }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: 'dashboard',
        loadComponent:  () => import('./features/admin/dashboard/admin-dashboard/admin-dashboard')
          .then(m => m.AdminDashboardComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: '403',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized')
      .then(m => m.UnauthorizedComponent)
  },

  {
    path: '**',
    redirectTo:  '/login'
  }
];
