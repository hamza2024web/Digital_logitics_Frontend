import { Routes } from '@angular/router';
import {AdminLayout} from './layout/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout/admin-layout')
      .then(m => m.AdminLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard/admin-dashboard')
          .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/user-list/user-list')
          .then(m => m.UserList)
      },
      {
        path: 'users/create',
        loadComponent:  () => import('./users/user-form/user-form')
          .then(m => m. UserForm)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
