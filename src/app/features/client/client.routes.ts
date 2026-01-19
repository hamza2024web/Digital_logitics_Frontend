// src/app/features/client/client.routes.ts
import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/client-layout/client-layout')
      .then(m => m.ClientLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent:  () => import('./dashboard/client-dashboard/client-dashboard')
          .then(m => m.ClientDashboardComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./my-orders/my-orders')
          .then(m => m.MyOrders)
      },
      {
        path: 'orders/:id',
        loadComponent:  () => import('./order-detail/order-detail')
          .then(m => m.OrderDetailComponent)
      },
      {
        path: 'new-order',
        loadComponent: () => import('./new-order/new-order.component')
          .then(m => m.NewOrderComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./products-catalog/products-catalog.component')
          .then(m => m. ProductsCatalogComponent)
      },
      {
        path: 'tracking',
        loadComponent: () => import('./tracking/tracking.component')
          .then(m => m.TrackingComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch:  'full'
      }
    ]
  }
];
