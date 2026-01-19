import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import {SalesOrder, SalesOrderStatus} from '../../../../api/models/sales-order.model';
import {ClientOrderApiService} from '../../../../api/services/SalesOrder-api.service';

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
  recentOrders: SalesOrder[] = [];
  isLoading = false;

  stats = {
    totalOrders:  0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0
  };

  // Exposer l'enum
  SalesOrderStatus = SalesOrderStatus;

  constructor(private clientOrderApiService: ClientOrderApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.clientOrderApiService. getMyOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 5); // 5 dernières commandes
        this.calculateStats(orders);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement commandes:', error);
        this.isLoading = false;
      }
    });
  }

  calculateStats(orders: SalesOrder[]): void {
    this.stats.totalOrders = orders.length;
    this.stats.pendingOrders = orders. filter(o =>
      o.status === SalesOrderStatus. CREATED ||
      o.status === SalesOrderStatus.RESERVED ||
      o.status === SalesOrderStatus.PARTIALLY_RESERVED
    ).length;
    this.stats.shippedOrders = orders.filter(o => o.status === SalesOrderStatus.SHIPPED).length;
    this.stats.deliveredOrders = orders.filter(o => o. status === SalesOrderStatus.DELIVERED).length;
  }

  getStatusLabel(status: SalesOrderStatus): string {
    const labels:  { [key in SalesOrderStatus]: string } = {
      [SalesOrderStatus.CREATED]: 'Créée',
      [SalesOrderStatus.PARTIALLY_RESERVED]: 'Partiellement réservée',
      [SalesOrderStatus.RESERVED]: 'Réservée',
      [SalesOrderStatus. AWAITING_SHIPMENT]: 'En attente',
      [SalesOrderStatus. SHIPPED]: 'Expédiée',
      [SalesOrderStatus.DELIVERED]: 'Livrée',
      [SalesOrderStatus. CANCELLED]: 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: SalesOrderStatus): string {
    const classes:  { [key in SalesOrderStatus]: string } = {
      [SalesOrderStatus.CREATED]:  'status-created',
      [SalesOrderStatus.PARTIALLY_RESERVED]: 'status-partial',
      [SalesOrderStatus. RESERVED]: 'status-reserved',
      [SalesOrderStatus.AWAITING_SHIPMENT]: 'status-waiting',
      [SalesOrderStatus.SHIPPED]: 'status-shipped',
      [SalesOrderStatus.DELIVERED]: 'status-delivered',
      [SalesOrderStatus.CANCELLED]: 'status-cancelled'
    };
    return classes[status] || '';
  }

  calculateTotal(order: SalesOrder): number {
    return order.lines.reduce((sum, line) => sum + (line.price * line.quantity), 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}
