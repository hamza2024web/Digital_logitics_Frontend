import { Component, OnInit } from '@angular/core';
import { PurchaseOrder, PurchaseOrderStatus } from '../../../api/models/purchse-order.model';
import { PurchaseOrderApiService } from '../../../api/services/purchase-order-api.model';
import { InventoryApiService } from '../../../api/services/inventory-api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-receive-order',
  imports: [CommonModule],
  templateUrl: './receive-order.html',
  styleUrl: './receive-order.scss',
})
export class ReceiveOrder implements OnInit {
  pendingOrders: PurchaseOrder[] = [];
  isLoading = false;
  errorMessage = '';

  // Exposer l'enum
  PurchaseOrderStatus = PurchaseOrderStatus;

  constructor(
    private purchaseOrderApiService: PurchaseOrderApiService,
    private inventoryApiService: InventoryApiService
  ) { }

  ngOnInit(): void {
    this.loadPendingOrders();
  }

  loadPendingOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.purchaseOrderApiService.getAllPurchaseOrders().subscribe({
      next: (orders) => {
        this.pendingOrders = orders.filter(order => order.status === PurchaseOrderStatus.SENT);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des commandes';
        this.isLoading = false;
      }
    });
  }

  receiveOrder(order: PurchaseOrder): void {
    if (!confirm(`Confirmer la réception de la commande #${order.id} du fournisseur "${order.supplierName}" ?`)) {
      return;
    }

    this.inventoryApiService.recordInbound(order.id).subscribe({
      next: (updatedOrder) => {
        alert(`Commande #${order.id} reçue avec succès ! \nStock mis à jour. `);
        this.loadPendingOrders();
      },
      error: (error) => {
        alert(`Erreur lors de la réception:  ${error.message}`);
      }
    });
  }

  calculateTotal(order: PurchaseOrder): number {
    return order.lines.reduce((sum, line) => sum + (line.price * line.quantityOrdered), 0);
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
