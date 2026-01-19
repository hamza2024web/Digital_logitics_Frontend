import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PurchaseOrder, PurchaseOrderStatus } from '../../../../api/models/purchse-order.model';
import { PurchaseOrderApiService } from '../../../../api/services/purchase-order-api.model';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase-order-list.html',
  styleUrl: './purchase-order-list.scss',
})
export class PurchaseOrderList implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  filteredOrders: PurchaseOrder[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  filterStatus: string = '';

  PurchaseOrderStatus = PurchaseOrderStatus;

  constructor(private purchaseOrderApiService: PurchaseOrderApiService) { }

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.purchaseOrderApiService.getAllPurchaseOrders().subscribe({
      next: (orders) => {
        this.purchaseOrders = orders;
        this.filteredOrders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des bons de commande';
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  setFilter(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredOrders = this.purchaseOrders.filter(order => {
      const matchesSearch = !this.searchTerm ||
        order.id.toString().includes(this.searchTerm) ||
        order.supplierName.toLowerCase().includes(this.searchTerm) ||
        order.destinationWarehouseCode.toLowerCase().includes(this.searchTerm);

      const matchesStatus = !this.filterStatus || order.status === this.filterStatus;

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatus = '';
    this.filteredOrders = this.purchaseOrders;
  }

  sendOrder(order: PurchaseOrder): void {
    if (order.status !== PurchaseOrderStatus.PENDING) {
      alert('Seuls les bons de commande en attente (PENDING) peuvent être envoyés');
      return;
    }

    if (!confirm(`Voulez-vous vraiment envoyer ce bon de commande au fournisseur "${order.supplierName}" ?`)) {
      return;
    }

    this.purchaseOrderApiService.sendPurchaseOrder(order.id).subscribe({
      next: (updatedOrder) => {
        const index = this.purchaseOrders.findIndex(o => o.id === updatedOrder.id);

        if (index !== -1) {
          this.purchaseOrders[index] = updatedOrder;
        }
        this.applyFilters();
        alert('Bon De Commande envoyé avec succès');
      },
      error: (error) => {
        alert(`Erreur lors de l'envoi:  ${error.message}`);
      }
    });
  }

  getStatusLabel(status: PurchaseOrderStatus): string {
    const labels: { [key in PurchaseOrderStatus]: string } = {
      [PurchaseOrderStatus.DRAFT]: 'Brouillon',
      [PurchaseOrderStatus.PENDING]: 'En attente',
      [PurchaseOrderStatus.SENT]: 'Envoyé',
      [PurchaseOrderStatus.RECEIVED]: 'Reçu',
      [PurchaseOrderStatus.CANCELLED]: 'Annulé'
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: PurchaseOrderStatus): string {
    const classes: { [key in PurchaseOrderStatus]: string } = {
      [PurchaseOrderStatus.DRAFT]: 'status-draft',
      [PurchaseOrderStatus.PENDING]: 'status-pending',
      [PurchaseOrderStatus.SENT]: 'status-sent',
      [PurchaseOrderStatus.RECEIVED]: 'status-received',
      [PurchaseOrderStatus.CANCELLED]: 'status-cancelled'
    };
    return classes[status] || '';
  }

  calculateTotal(order: PurchaseOrder): number {
    return order.lines.reduce((sum, line) => sum + (line.price * line.quantityOrdered), 0);
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
