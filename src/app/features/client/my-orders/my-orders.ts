import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalesOrder, SalesOrderStatus } from '../../../api/models/sales-order.model';
import { ClientOrderApiService } from '../../../api/services/client-order-api.service';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrders {
  orders: SalesOrder[] = [];
  filteredOrders: SalesOrder[] = [];
  isLoading = false;
  errorMessage = '';
  filterStatus: string = '';

  SalesOrderStatus = SalesOrderStatus;

  constructor(private clientOrderApiService: ClientOrderApiService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientOrderApiService.getMyOrders().subscribe({
      next: (orders: SalesOrder[]) => {
        this.orders = orders.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.filteredOrders = orders;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des commandes';
        this.isLoading = false;
      }
    });
  }

  onFilterStatus(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterStatus = select.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      return !this.filterStatus || order.status === this.filterStatus;
    });
  }

  resetFilters(): void {
    this.filterStatus = '';
    this.filteredOrders = this.orders;
  }

  reserveStock(order: SalesOrder): void {
    if (order.status !== SalesOrderStatus.CREATED) {
      alert('Seules les commandes créées peuvent être réservées');
      return;
    }

    if (!confirm('Voulez-vous réserver le stock pour cette commande ?')) {
      return;
    }

    this.clientOrderApiService.reserveOrderStock(order.id).subscribe({
      next: (updatedOrder) => {
        alert('Stock réservé avec succès ! ');
        this.loadOrders();
      },
      error: (error) => {
        alert(`Erreur:  ${error.message}`);
      }
    });
  }

  // Mêmes méthodes utilitaires que le dashboard
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
    return order.lines.reduce((sum, line) => sum + (line.price * line.quantity), 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}
