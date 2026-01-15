import { Routes } from '@angular/router';
import {AdminLayout} from './layout/admin-layout/admin-layout';
import {UserFormComponent} from './users/user-form/user-form';

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
          .then(m => m. UserFormComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
