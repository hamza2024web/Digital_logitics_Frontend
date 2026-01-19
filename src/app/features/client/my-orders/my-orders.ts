import { Component } from '@angular/core';
import {SalesOrder, SalesOrderStatus} from '../../../api/models/sales-order.model';
import {ClientOrderApiService} from '../../../api/services/SalesOrder-api.service';

@Component({
  selector: 'app-my-orders',
  imports: [],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrders {
  orders: SalesOrder[] = [];
  filteredOrders: SalesOrder[] = [];
  isLoading = false;
  errorMessage = '';
  filterStatus:  string = '';

  SalesOrderStatus = SalesOrderStatus;

  constructor(private clientOrderApiService: ClientOrderApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientOrderApiService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders. sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.filteredOrders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des commandes';
        this.isLoading = false;
      }
    });
  }

  onFilterStatus(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterStatus = select. value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      return ! this.filterStatus || order.status === this.filterStatus;
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

    if (! confirm('Voulez-vous réserver le stock pour cette commande ?')) {
      return;
    }

    this.clientOrderApiService. reserveOrderStock(order.id).subscribe({
      next: (updatedOrder) => {
        alert('Stock réservé avec succès ! ');
        this.loadOrders();
      },
      error:  (error) => {
        alert(`Erreur:  ${error.message}`);
      }
    });
  }

  // Mêmes méthodes utilitaires que le dashboard
  getStatusLabel(status: SalesOrderStatus): string {

  }

  getStatusBadgeClass(status: SalesOrderStatus): string {

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
