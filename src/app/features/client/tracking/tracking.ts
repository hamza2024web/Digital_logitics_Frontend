import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalesOrder, SalesOrderStatus } from '../../../api/models/sales-order.model';
import { ClientOrderApiService } from '../../../api/services/client-order-api.service';
import { ShipmentStatus } from '../../../api/models/shipment.model';

@Component({
  selector: 'app-tracking',
  imports: [CommonModule, RouterLink],
  templateUrl: './tracking.html',
  styleUrl: './tracking.scss',
})
export class Tracking implements OnInit {
  ordersWithShipment: SalesOrder[] = [];
  isLoading = false;
  errorMessage = '';

  // Exposer les enums
  SalesOrderStatus = SalesOrderStatus;
  ShipmentStatus = ShipmentStatus;

  constructor(private clientOrderApiService: ClientOrderApiService) { }

  ngOnInit(): void {
    this.loadOrdersWithShipment();
  }

  loadOrdersWithShipment(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientOrderApiService.getMyOrders().subscribe({
      next: (orders: SalesOrder[]) => {
        this.ordersWithShipment = orders
          .filter(o => o.shipment)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des expéditions';
        this.isLoading = false;
      }
    });
  }

  getShipmentProgress(status: ShipmentStatus): number {
    const progress: { [key in ShipmentStatus]: number } = {
      [ShipmentStatus.PLANNED]: 33,
      [ShipmentStatus.IN_TRANSIT]: 66,
      [ShipmentStatus.DELIVERED]: 100,
      [ShipmentStatus.CANCELLED]: 0
    };
    return progress[status] || 0;
  }

  getDeliverySteps(order: SalesOrder): { label: string; completed: boolean; active: boolean }[] {
    const shipmentStatus = order.shipment?.status;

    return [
      {
        label: 'Commande confirmée',
        completed: true,
        active: false
      },
      {
        label: 'Expédition planifiée',
        completed: shipmentStatus !== ShipmentStatus.PLANNED,
        active: shipmentStatus === ShipmentStatus.PLANNED
      },
      {
        label: 'En transit',
        completed: shipmentStatus === ShipmentStatus.DELIVERED,
        active: shipmentStatus === ShipmentStatus.IN_TRANSIT
      },
      {
        label: 'Livrée',
        completed: shipmentStatus === ShipmentStatus.DELIVERED,
        active: shipmentStatus === ShipmentStatus.DELIVERED
      }
    ];
  }

  refresh(): void {
    this.loadOrdersWithShipment();
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

  getShipmentStatusBadgeClass(status: ShipmentStatus): string {
    const classes: { [key in ShipmentStatus]: string } = {
      [ShipmentStatus.PLANNED]: 'shipment-planned',
      [ShipmentStatus.IN_TRANSIT]: 'shipment-transit',
      [ShipmentStatus.DELIVERED]: 'shipment-delivered',
      [ShipmentStatus.CANCELLED]: 'shipment-cancelled'
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

  calculateTotal(order: SalesOrder): number {
    return order.lines.reduce((sum, line) => sum + (line.price * line.quantity), 0);
  }


  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}
