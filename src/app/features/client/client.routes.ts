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
          .then(m => m.OrderDetail)
      },
      {
        path: 'new-order',
        loadComponent: () => import('./new-order/new-order')
          .then(m => m.NewOrder)
      },
      {
        path: 'products',
        loadComponent: () => import('./products-catalog/products-catalog')
          .then(m => m. ProductsCatalog)
      },
      {
        path: 'tracking',
        loadComponent: () => import('./tracking/tracking')
          .then(m => m.Tracking)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch:  'full'
      }
    ]
  }
];
