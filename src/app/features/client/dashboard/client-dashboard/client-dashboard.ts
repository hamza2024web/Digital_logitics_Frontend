import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

interface Order {
  id: string;
  status: 'CREATED' | 'RESERVED' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  date: string;
  total: number;
  items: number;
  warehouse: string;
  trackingNumber?: string;
}

interface Notification {
  id: number;
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  time: string;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.scss'
})
export class ClientDashboardComponent implements OnInit {
  private authService = inject(AuthService);

  userEmail = '';
  userRole = '';
  userName = 'Client';
  currentDate = new Date();
  sidebarCollapsed = false;

  // KPI Data - will be populated from API
  stats = {
    ordersInProgress: 0,
    ordersDelivered: 0,
    ordersPending: 0,
    totalSpent: 0
  };

  // Order lifecycle stages
  orderStages = [
    { status: 'CREATED', label: 'Créée', icon: '📝', count: 0 },
    { status: 'RESERVED', label: 'Réservée', icon: '📦', count: 0 },
    { status: 'SHIPPED', label: 'Expédiée', icon: '🚚', count: 0 },
    { status: 'DELIVERED', label: 'Livrée', icon: '✅', count: 0 }
  ];

  // Data arrays - will be populated from API
  recentOrders: Order[] = [];
  activeShipments: { orderId: string; carrier: string; trackingNumber: string; status: string; eta: string; progress: number }[] = [];
  notifications: Notification[] = [];

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.userRole = this.authService.getUserRole();
    this.userName = this.userEmail.split('@')[0] || 'Client';
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'CREATED': 'status-created',
      'RESERVED': 'status-reserved',
      'SHIPPED': 'status-shipped',
      'DELIVERED': 'status-delivered',
      'CANCELED': 'status-canceled',
      'PLANNED': 'status-planned',
      'IN_TRANSIT': 'status-transit'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'CREATED': 'Créée',
      'RESERVED': 'Réservée',
      'SHIPPED': 'Expédiée',
      'DELIVERED': 'Livrée',
      'CANCELED': 'Annulée',
      'PLANNED': 'Planifiée',
      'IN_TRANSIT': 'En transit'
    };
    return labels[status] || status;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  }
}
