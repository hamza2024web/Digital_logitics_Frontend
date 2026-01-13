import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'client',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CLIENT'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/client/dashboard/client-dashboard/client-dashboard')
          .then(m => m.ClientDashboardComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'warehouse',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['WAREHOUSE_MANAGER'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/warehouse/dashboard/warehouse-dashboard/warehouse-dashboard')
          .then(m => m.WarehouseDashboardComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },

  {
    path: '403',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized')
      .then(m => m.UnauthorizedComponent)
  },

  {
    path: '**',
    redirectTo: '/login'
  }
];
