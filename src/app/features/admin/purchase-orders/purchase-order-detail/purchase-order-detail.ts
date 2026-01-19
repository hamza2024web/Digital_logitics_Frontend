import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PurchaseOrder, PurchaseOrderStatus } from '../../../../api/models/purchse-order.model';
import { PurchaseOrderApiService } from '../../../../api/services/purchase-order-api.model';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-order-detail.html',
  styleUrl: './purchase-order-detail.scss',
})
export class PurchaseOrderDetail implements OnInit {
  purchaseOrder: PurchaseOrder | null = null;
  isLoading = false;
  errorMessage = '';
  orderId: number | null = null;

  PurchaseOrderStatus = PurchaseOrderStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderApiService: PurchaseOrderApiService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = +params['id'];
        this.loadPurchaseOrder(this.orderId);
      }
    });
  }

  private loadPurchaseOrder(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.purchaseOrderApiService.getPurchaseOrderById(id).subscribe({
      next: (order) => {
        this.purchaseOrder = order;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement du bon de commande';
        this.isLoading = false;
      }
    });
  }

  sendOrder(): void {
    if (!this.purchaseOrder) return;

    if (this.purchaseOrder.status !== PurchaseOrderStatus.PENDING) {
      alert('Seuls les bons de commande en attente (PENDING) peuvent être envoyés');
      return;
    }

    if (!confirm(`Voulez-vous vraiment envoyer ce bon de commande au fournisseur "${this.purchaseOrder.supplierName}" ?`)) {
      return;
    }

    this.purchaseOrderApiService.sendPurchaseOrder(this.purchaseOrder.id).subscribe({
      next: (updatedOrder) => {
        this.purchaseOrder = updatedOrder;
        alert('Bon de commande envoyé avec succès');
      },
      error: (error) => {
        alert(`Erreur lors de l'envoi:  ${error.message}`);
      }
    });
  }

  cancelOrder(): void {
    if (!this.purchaseOrder) return;

    if (this.purchaseOrder.status === PurchaseOrderStatus.RECEIVED) {
      alert('Impossible d\'annuler un bon de commande déjà reçu');
      return;
    }

    if (!confirm('Voulez-vous vraiment annuler ce bon de commande ?')) {
      return;
    }

    this.purchaseOrderApiService.cancelPurchaseOrder(this.purchaseOrder.id).subscribe({
      next: (updatedOrder) => {
        this.purchaseOrder = updatedOrder;
        alert('Bon de commande annulé');
      },
      error: (error) => {
        alert(`Erreur lors de l'annulation:  ${error.message}`);
      }
    });
  }

  refresh(): void {
    if (this.orderId) {
      this.loadPurchaseOrder(this.orderId);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/purchase-orders']);
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

  getStatusIcon(status: PurchaseOrderStatus): string {
    const icons: { [key in PurchaseOrderStatus]: string } = {
      [PurchaseOrderStatus.DRAFT]: '📝',
      [PurchaseOrderStatus.PENDING]: '⏳',
      [PurchaseOrderStatus.SENT]: '📤',
      [PurchaseOrderStatus.RECEIVED]: '✅',
      [PurchaseOrderStatus.CANCELLED]: '❌'
    };
    return icons[status] || '📋';
  }

  getLineSubtotal(quantityOrdered: number, price: number): number {
    return quantityOrdered * price;
  }

  getOrderTotal(): number {
    if (!this.purchaseOrder) return 0;
    return this.purchaseOrder.lines.reduce((sum, line) =>
      sum + (line.price * line.quantityOrdered), 0
    );
  }

  getTotalItems(): number {
    if (!this.purchaseOrder) return 0;
    return this.purchaseOrder.lines.reduce((sum, line) =>
      sum + line.quantityOrdered, 0
    );
  }

  getReceptionRate(): number {
    if (!this.purchaseOrder) return 0;
    const totalOrdered = this.purchaseOrder.lines.reduce((sum, line) => sum + line.quantityOrdered, 0);
    const totalReceived = this.purchaseOrder.lines.reduce((sum, line) => sum + line.quantityReserved, 0);
    if (totalOrdered === 0) return 0;
    return (totalReceived / totalOrdered) * 100;
  }

  isLineFullyReceived(quantityOrdered: number, quantityReceived: number): boolean {
    return quantityReceived >= quantityOrdered;
  }

  isLinePartiallyReceived(quantityReceived: number): boolean {
    return quantityReceived > 0;
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

  getTimeElapsed(): string {
    if (!this.purchaseOrder) return '';

    const created = new Date(this.purchaseOrder.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffMinutes > 0) {
      return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else {
      return 'À l\'instant';
    }
  }

  canSend(): boolean {
    return this.purchaseOrder?.status === PurchaseOrderStatus.PENDING;
  }

  canCancel(): boolean {
    return this.purchaseOrder?.status !== PurchaseOrderStatus.RECEIVED &&
      this.purchaseOrder?.status !== PurchaseOrderStatus.CANCELLED;
  }

  print(): void {
    window.print();
  }

  exportPDF(): void {
    alert('Fonctionnalité à implémenter:  Export PDF');
  }
}
