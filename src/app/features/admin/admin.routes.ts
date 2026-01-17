import { Routes } from '@angular/router';
import {PurchaseOrderList} from './purchase-orders/purchase-order-list/purchase-order-list';

export const ADMIN_ROUTES:  Routes = [
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
        path:  'products',
        loadComponent: () => import('./products/products-list/products-list')
          .then(m => m.ProductsListComponent)
      },
      {
        path: 'products/create',
        loadComponent: () => import('./products/product-form/product-form')
          .then(m => m.ProductFormComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./products/product-form/product-form')
          .then(m => m.ProductFormComponent)
      },
      {
        path:  'warehouses',
        loadComponent: () => import('./warehouses/warehouse-list/warehouse-list')
          .then(m => m. WarehouseListComponent)
      },
      {
        path: 'warehouses/create',
        loadComponent:  () => import('./warehouses/warehouse-form/warehouse-form')
          .then(m => m.WarehouseFormComponent)
      },
      {
        path: 'warehouses/edit/:id',
        loadComponent: () => import('./warehouses/warehouse-form/warehouse-form')
          .then(m => m.WarehouseFormComponent)
      },
      {        path: 'suppliers',
        loadComponent: () => import('./suppliers/supplier-list/supplier-list')
          .then(m => m.SupplierList)
      },
      {
        path: 'suppliers/create',
        loadComponent: () => import('./suppliers/supplier-form/supplier-form')
          .then(m => m.SupplierForm)
      },
      {
        path: 'suppliers/edit/:id',
        loadComponent: () => import('./suppliers/supplier-form/supplier-form')
          .then(m => m.SupplierForm)
      },
      {
        path: 'suppliers',
        loadComponent : () => import('./suppliers/supplier-list/supplier-list')
          .then(m => m.SupplierList)
      },
      {
        path: 'suppliers/create',
        loadComponent: () => import('./suppliers/supplier-form/supplier-form')
          .then(m => m.SupplierForm)
      },
      {
        path: 'suppliers/edit/:id',
        loadComponent: () => import('./suppliers/supplier-form/supplier-form')
          .then(m => m.SupplierForm)
      },
      {
        path: 'purchase-orders',
        loadComponent: () => import('./purchase-orders/purchase-order-list/purchase-order-list')
          .then(m => m.PurchaseOrderList)
      },
      {
        path: 'purchase-orders/create',
        loadComponent: () => import('./purchase-orders/purchase-order-form/purchase-order-form')
          .then(m => m.PurchaseOrderForm)
      },
      {
        path: 'purchase-orders/:id',
        loadComponent: () => import('./purchase-orders/purchase-order-detail/purchase-order-detail')
          .then(m => m.PurchaseOrderDetail)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
