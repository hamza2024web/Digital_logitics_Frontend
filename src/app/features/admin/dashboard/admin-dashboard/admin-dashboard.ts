import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  totalStock: number;
  status: 'ACTIVE' | 'INACTIVE' | 'LOW_STOCK';
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT';
  status: 'ACTIVE' | 'INACTIVE';
  joinedDate: string;
}

interface Warehouse {
  id: number;
  name: string;
  city: string;
  capacity: number;
  utilization: number;
  manager: string;
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  warehouse: string;
  status: 'DRAFT' | 'SENT' | 'PARTIAL' | 'RECEIVED' | 'CANCELED';
  total: number;
  expectedDate: string;
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

  userEmail = '';
  userRole = '';
  userName = 'Admin';
  currentDate = new Date();
  sidebarCollapsed = false;
  activeTab = 'overview';

  // Platform KPIs - will be populated from API
  stats = {
    totalUsers: 0,
    activeClients: 0,
    totalProducts: 0,
    activeWarehouses: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockAlerts: 0
  };

  // User distribution - will be populated from API
  userDistribution: { role: string; count: number; percentage: number; color: string }[] = [];

  // Data arrays - will be populated from API
  recentProducts: Product[] = [];
  recentUsers: User[] = [];
  warehouses: Warehouse[] = [];
  purchaseOrders: PurchaseOrder[] = [];
  recentActivities: { user: string; action: string; time: string; type: string }[] = [];

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.userRole = this.authService.getUserRole();
    this.userName = this.userEmail.split('@')[0] || 'Admin';
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  logout(): void {
    this.authService.logout();
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'ACTIVE': 'status-active',
      'INACTIVE': 'status-inactive',
      'LOW_STOCK': 'status-warning',
      'DRAFT': 'status-draft',
      'SENT': 'status-sent',
      'PARTIAL': 'status-partial',
      'RECEIVED': 'status-received',
      'CANCELED': 'status-canceled'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'ACTIVE': 'Actif',
      'INACTIVE': 'Inactif',
      'LOW_STOCK': 'Stock Faible',
      'DRAFT': 'Brouillon',
      'SENT': 'Envoyée',
      'PARTIAL': 'Partielle',
      'RECEIVED': 'Reçue',
      'CANCELED': 'Annulée',
      'ADMIN': 'Admin',
      'WAREHOUSE_MANAGER': 'Gestionnaire',
      'CLIENT': 'Client'
    };
    return labels[status] || status;
  }

  getRoleClass(role: string): string {
    const classes: Record<string, string> = {
      'ADMIN': 'role-admin',
      'WAREHOUSE_MANAGER': 'role-manager',
      'CLIENT': 'role-client'
    };
    return classes[role] || '';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      'order': '🛒',
      'stock': '📦',
      'alert': '⚠️',
      'user': '👤',
      'shipment': '🚚'
    };
    return icons[type] || '📋';
  }
}
