import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { ProductApiService } from '../../../../api/services/product-api.service';
import { UserApiService } from '../../../../api/services/user-api.service';
import { WarehouseApiService } from '../../../../api/services/warehouse-api.service';

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  active: boolean;
  image?: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT';
  active: boolean;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
  city: string;
  utilization: number;
}

interface Activity {
  id: number;
  type: 'user' | 'product' | 'order' | 'warehouse';
  message: string;
  time: string;
}

interface SalesData {
  label: string;
  value: number;
  percentage: number;
}

interface UserDistribution {
  role: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private productApiService = inject(ProductApiService);
  private userApiService = inject(UserApiService);
  private warehouseApiService = inject(WarehouseApiService);

  userName = 'Admin';
  currentDate = new Date();

  // Stats - will be populated from API
  stats = {
    totalUsers: 0,
    totalProducts: 0,
    totalWarehouses: 0,
    monthlyRevenue: 0
  };

  // Data arrays
  recentProducts: Product[] = [];
  recentUsers: User[] = [];
  warehouses: Warehouse[] = [];
  recentActivities: Activity[] = [];
  salesData: SalesData[] = [];
  userDistribution: UserDistribution[] = [];

  ngOnInit(): void {
    const userEmail = this.authService.getUserEmail();
    this.userName = userEmail ? userEmail.split('@')[0] : 'Admin';

    this.loadData();
    this.initializeMockData();
  }

  loadData(): void {
    // Load products
    this.productApiService.getAllProducts().subscribe({
      next: (products) => {
        this.stats.totalProducts = products.length;
        this.recentProducts = products.slice(0, 5).map(p => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          price: p.price,
          active: p.active,
          image: p.image
        }));
      },
      error: () => {
        // Use mock data on error
        this.stats.totalProducts = 45;
      }
    });

    // Load users
    this.userApiService.getAllUsers().subscribe({
      next: (users) => {
        this.stats.totalUsers = users.length;
        this.recentUsers = users.slice(0, 5).map(u => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          role: u.role,
          active: u.active
        }));
        this.calculateUserDistribution(users);
      },
      error: () => {
        this.stats.totalUsers = 156;
        this.setMockUserDistribution();
      }
    });

    // Load warehouses
    this.warehouseApiService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.stats.totalWarehouses = warehouses.length;
        this.warehouses = warehouses.map(w => ({
          id: w.id,
          name: w.name,
          code: w.code,
          city: 'Paris', // Default city
          utilization: Math.floor(Math.random() * 40) + 50 // Random utilization 50-90%
        }));
      },
      error: () => {
        this.stats.totalWarehouses = 4;
        this.setMockWarehouses();
      }
    });
  }

  initializeMockData(): void {
    // Mock revenue (frontend only)
    this.stats.monthlyRevenue = 127450;

    // Mock sales data for chart
    this.salesData = [
      { label: 'Lun', value: 1250, percentage: 45 },
      { label: 'Mar', value: 1890, percentage: 68 },
      { label: 'Mer', value: 2100, percentage: 76 },
      { label: 'Jeu', value: 1650, percentage: 60 },
      { label: 'Ven', value: 2800, percentage: 100 },
      { label: 'Sam', value: 2200, percentage: 79 },
      { label: 'Dim', value: 1400, percentage: 50 }
    ];

    // Mock recent activities
    this.recentActivities = [
      { id: 1, type: 'order', message: 'Nouvelle commande #1234 reçue', time: 'Il y a 5 min' },
      { id: 2, type: 'user', message: 'Nouvel utilisateur inscrit: Marie Dupont', time: 'Il y a 15 min' },
      { id: 3, type: 'product', message: 'Stock bas pour SKU-789 (< 10 unités)', time: 'Il y a 30 min' },
      { id: 4, type: 'warehouse', message: 'Entrepôt Paris-Nord à 85% de capacité', time: 'Il y a 1h' },
      { id: 5, type: 'order', message: 'Commande #1233 expédiée', time: 'Il y a 2h' },
      { id: 6, type: 'product', message: 'Nouveau produit ajouté: Widget Pro', time: 'Il y a 3h' }
    ];
  }

  calculateUserDistribution(users: any[]): void {
    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    const managerCount = users.filter(u => u.role === 'WAREHOUSE_MANAGER').length;
    const clientCount = users.filter(u => u.role === 'CLIENT').length;
    const total = users.length || 1;

    this.userDistribution = [
      { role: 'ADMIN', label: 'Administrateurs', count: adminCount, percentage: Math.round((adminCount / total) * 100), color: '#f97316' },
      { role: 'WAREHOUSE_MANAGER', label: 'Gestionnaires', count: managerCount, percentage: Math.round((managerCount / total) * 100), color: '#8b5cf6' },
      { role: 'CLIENT', label: 'Clients', count: clientCount, percentage: Math.round((clientCount / total) * 100), color: '#06b6d4' }
    ];
  }

  setMockUserDistribution(): void {
    this.userDistribution = [
      { role: 'ADMIN', label: 'Administrateurs', count: 8, percentage: 5, color: '#f97316' },
      { role: 'WAREHOUSE_MANAGER', label: 'Gestionnaires', count: 24, percentage: 15, color: '#8b5cf6' },
      { role: 'CLIENT', label: 'Clients', count: 124, percentage: 80, color: '#06b6d4' }
    ];
  }

  setMockWarehouses(): void {
    this.warehouses = [
      { id: 1, name: 'Entrepôt Paris-Nord', code: 'WH-PAR-N', city: 'Paris', utilization: 72 },
      { id: 2, name: 'Entrepôt Lyon', code: 'WH-LYO', city: 'Lyon', utilization: 85 },
      { id: 3, name: 'Entrepôt Marseille', code: 'WH-MAR', city: 'Marseille', utilization: 58 },
      { id: 4, name: 'Entrepôt Bordeaux', code: 'WH-BDX', city: 'Bordeaux', utilization: 91 }
    ];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }
}
