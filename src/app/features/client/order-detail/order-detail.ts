import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientOrderApiService } from '../../../api/services/client-order-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesOrder, SalesOrderLineStatus, SalesOrderStatus } from '../../../api/models/sales-order.model';
import { ShipmentStatus } from '../../../api/models/shipment.model';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail implements OnInit {
  order: SalesOrder | null = null;
  isLoading = false;
  errorMessage = '';
  orderId: number | null = null;

  // Exposer les enums
  SalesOrderStatus = SalesOrderStatus;
  SalesOrderLineStatus = SalesOrderLineStatus;
  ShipmentStatus = ShipmentStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientOrderApiService: ClientOrderApiService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idParam = params['id'];

      if (idParam && !isNaN(+idParam)) {
        this.orderId = +idParam;
        this.loadOrder(this.orderId);
      } else if (idParam) {
        this.errorMessage = 'ID de commande invalide.';
      }
    });
  }

  private loadOrder(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientOrderApiService.getOrderById(id).subscribe({
      next: (order: SalesOrder) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'Erreur lors du chargement de la commande';
        this.isLoading = false;
      }
    });
  }


  reserveStock(): void {
    if (!this.order || !this.orderId) return;

    if (this.order.status !== SalesOrderStatus.CREATED) {
      alert('Seules les commandes créées peuvent être réservées');
      return;
    }

    if (!confirm('Voulez-vous réserver le stock pour cette commande ? ')) {
      return;
    }

    this.clientOrderApiService.reserveOrderStock(this.orderId).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        alert('Stock réservé avec succès !');
      },
      error: (error) => {
        alert(`Erreur: ${error.message}`);
      }
    });
  }


  refresh(): void {
    if (this.orderId) {
      this.loadOrder(this.orderId);
    }
  }


  goBack(): void {
    this.router.navigate(['/client/orders']);
  }

  canReserve(): boolean {
    return this.order?.status === SalesOrderStatus.CREATED;
  }

  getOrderTotal(): number {
    if (!this.order) return 0;
    return this.order.lines.reduce((sum, line) => sum + (line.price * line.quantity), 0);
  }

  getTotalItems(): number {
    if (!this.order) return 0;
    return this.order.lines.reduce((sum, line) => sum + line.quantity, 0);
  }

  getProgressPercentage(): number {
    if (!this.order) return 0;

    const statusProgress: { [key in SalesOrderStatus]: number } = {
      [SalesOrderStatus.CREATED]: 20,
      [SalesOrderStatus.PARTIALLY_RESERVED]: 40,
      [SalesOrderStatus.RESERVED]: 60,
      [SalesOrderStatus.AWAITING_SHIPMENT]: 70,
      [SalesOrderStatus.SHIPPED]: 85,
      [SalesOrderStatus.DELIVERED]: 100,
      [SalesOrderStatus.CANCELLED]: 0
    };

    return statusProgress[this.order.status] || 0;
  }

  getOrderStatusLabel(status: SalesOrderStatus): string {
    const labels: { [key in SalesOrderStatus]: string } = {
      [SalesOrderStatus.CREATED]: 'Créée',
      [SalesOrderStatus.PARTIALLY_RESERVED]: 'Partiellement réservée',
      [SalesOrderStatus.RESERVED]: 'Réservée',
      [SalesOrderStatus.AWAITING_SHIPMENT]: 'En attente d\'expédition',
      [SalesOrderStatus.SHIPPED]: 'Expédiée',
      [SalesOrderStatus.DELIVERED]: 'Livrée',
      [SalesOrderStatus.CANCELLED]: 'Annulée'
    };
    return labels[status] || status;
  }

  getLineStatusLabel(status: SalesOrderLineStatus): string {
    const labels: { [key in SalesOrderLineStatus]: string } = {
      [SalesOrderLineStatus.CREATED]: 'Créée',
      [SalesOrderLineStatus.RESERVED]: 'Réservée',
      [SalesOrderLineStatus.BACKORDERED]: 'En rupture',
      [SalesOrderLineStatus.AWAITING_TRANSFER]: 'En attente de transfert'
    };
    return labels[status] || status;
  }

  getShipmentStatusLabel(status: ShipmentStatus): string {
    const labels: { [key in ShipmentStatus]: string } = {
      [ShipmentStatus.PLANNED]: 'Planifiée',
      [ShipmentStatus.IN_TRANSIT]: 'En transit',
      [ShipmentStatus.DELIVERED]: 'Livrée',
      [ShipmentStatus.CANCELLED]: 'Annulée'
    };
    return labels[status] || status;
  }

  getOrderStatusBadgeClass(status: SalesOrderStatus): string {
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

  getLineStatusBadgeClass(status: SalesOrderLineStatus): string {
    const classes: { [key in SalesOrderLineStatus]: string } = {
      [SalesOrderLineStatus.CREATED]: 'line-created',
      [SalesOrderLineStatus.RESERVED]: 'line-reserved',
      [SalesOrderLineStatus.BACKORDERED]: 'line-backordered',
      [SalesOrderLineStatus.AWAITING_TRANSFER]: 'line-transfer'
    };
    return classes[status] || '';
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
