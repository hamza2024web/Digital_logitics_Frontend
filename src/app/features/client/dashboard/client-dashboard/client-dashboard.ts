import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { SalesOrder, SalesOrderStatus } from '../../../../api/models/sales-order.model';
import { ClientOrderApiService } from '../../../../api/services/client-order-api.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.scss'
})
export class ClientDashboardComponent implements OnInit {
  recentOrders: SalesOrder[] = [];
  isLoading = false;
  userName = 'Client';

  stats = {
    ordersInProgress: 0,
    ordersDelivered: 0,
    ordersPending: 0,
    totalSpent: 0
  };

  SalesOrderStatus = SalesOrderStatus;

  constructor(
    private clientOrderApiService: ClientOrderApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.firstName ? `${user.firstName} ${user.lastName}` : user.email;
    }
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.clientOrderApiService.getMyOrders().subscribe({
      next: (orders) => {
        // Sort by date desc
        const sortedOrders = orders.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.recentOrders = sortedOrders.slice(0, 5);
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
    const activeStatuses = [
      SalesOrderStatus.CREATED,
      SalesOrderStatus.PARTIALLY_RESERVED,
      SalesOrderStatus.RESERVED,
      SalesOrderStatus.AWAITING_SHIPMENT,
      SalesOrderStatus.SHIPPED
    ];

    this.stats.ordersInProgress = orders.filter(o => activeStatuses.includes(o.status)).length;

    this.stats.ordersPending = orders.filter(o =>
      o.status === SalesOrderStatus.CREATED ||
      o.status === SalesOrderStatus.PARTIALLY_RESERVED ||
      o.status === SalesOrderStatus.RESERVED
    ).length;

    this.stats.ordersDelivered = orders.filter(o => o.status === SalesOrderStatus.DELIVERED).length;

    this.stats.totalSpent = orders.reduce((sum, order) => sum + this.calculateTotal(order), 0);
  }

  getStatusLabel(status: SalesOrderStatus): string {
    const labels: { [key in SalesOrderStatus]: string } = {
      [SalesOrderStatus.CREATED]: 'Créée',
      [SalesOrderStatus.PARTIALLY_RESERVED]: 'Partiellement réservée',
      [SalesOrderStatus.RESERVED]: 'Réservée',
      [SalesOrderStatus.AWAITING_SHIPMENT]: 'En attente',
      [SalesOrderStatus.SHIPPED]: 'Expédiée',
      [SalesOrderStatus.DELIVERED]: 'Livrée',
      [SalesOrderStatus.CANCELLED]: 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: SalesOrderStatus): string {
    const classes: { [key in SalesOrderStatus]: string } = {
      [SalesOrderStatus.CREATED]: 'status-created',
      [SalesOrderStatus.PARTIALLY_RESERVED]: 'status-partial',
      [SalesOrderStatus.RESERVED]: 'status-reserved',
      [SalesOrderStatus.AWAITING_SHIPMENT]: 'status-waiting',
      [SalesOrderStatus.SHIPPED]: 'status-shipped',
      [SalesOrderStatus.DELIVERED]: 'status-delivered',
      [SalesOrderStatus.CANCELLED]: 'status-cancelled'
    };
    return classes[status] || '';
  }

  calculateTotal(order: SalesOrder): number {
    if (!order.lines) return 0;
    return order.lines.reduce((sum, line) => sum + (line.price * line.quantity), 0);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  }
}

