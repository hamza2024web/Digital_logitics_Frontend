// src/app/features/warehouse-manager/warehouse-manager.routes.ts
import { Routes } from '@angular/router';
import {WarehouseDashboardComponent} from './dashboard/warehouse-dashboard/warehouse-dashboard';

export const WAREHOUSE_MANAGER_ROUTES:  Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/warehouse-manager-layout/warehouse-manager-layout')
      .then(m => m.WarehouseManagerLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/warehouse-dashboard/warehouse-dashboard')
          .then(m => m. WarehouseDashboardComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./inventory-list/inventory-list')
          .then(m => m. InventoryList)
      },
      {
        path:  'receive-orders',
        loadComponent: () => import('./receive-order/receive-order')
          .then(m => m.ReceiveOrder)
      },
      {
        path: 'adjustment',
        loadComponent: () => import('./stock-adjustment/stock-adjustment')
          .then(m => m.StockAdjustment)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch:  'full'
      }
    ]
  }
];
