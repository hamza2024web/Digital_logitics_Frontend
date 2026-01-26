import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SalesOrder, SalesOrderStatus } from '../../../../api/models/sales-order.model';
import { ShipmentCreateRequest, ShipmentStatus } from '../../../../api/models/shipment.model';
import { ShipmentApiService } from '../../../../api/services/shipment-api.service';
import {SalesOrderApiService} from '../../../../api/services/sales-order-api.service';

@Component({
  selector: 'app-sales-order-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales-order-detail.html',
  styleUrl: './sales-order-detail.scss',
})
export class SalesOrderDetail implements OnInit {
  salesOrder: SalesOrder | null = null;
  isLoading = false;
  errorMessage = '';
  orderId: number | null = null;

  shipmentForm!: FormGroup;
  isCreatingShipment = false;
  showShipmentForm = false;

  SalesOrderStatus = SalesOrderStatus;
  ShipmentStatus = ShipmentStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private salesOrderApiService: SalesOrderApiService,
    private shipmentApiService: ShipmentApiService
  ) { }

  ngOnInit(): void {
    this.initShipmentForm();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = +params['id'];
        this.loadSalesOrder(this.orderId);
      }
    });
  }

  private initShipmentForm(): void {
    this.shipmentForm = this.fb.group({
      trackingNumber: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  private loadSalesOrder(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.salesOrderApiService.getSalesOrderById(id).subscribe({
      next: (order: SalesOrder) => {
        this.salesOrder = order;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'Erreur lors du chargement de la commande';
        this.isLoading = false;
      }
    });
  }

  toggleShipmentForm(): void {
    this.showShipmentForm = !this.showShipmentForm;
  }

  createShipment(): void {
    if (!this.salesOrder || !this.orderId) return;

    if (this.shipmentForm.invalid) {
      this.shipmentForm.markAllAsTouched();
      return;
    }

    this.isCreatingShipment = true;

    const shipmentData: ShipmentCreateRequest = {
      trackingNumber: this.shipmentForm.value.trackingNumber
    };

    this.shipmentApiService.createShipmentForOrder(this.orderId, shipmentData).subscribe({
      next: (shipment) => {
        alert(`Expédition créée avec succès !  Numéro de suivi:  ${shipment.trackingNumber}`);
        this.loadSalesOrder(this.orderId!);
        this.showShipmentForm = false;
        this.shipmentForm.reset();
        this.isCreatingShipment = false;
      },
      error: (error) => {
        alert(`Erreur: ${error.message}`);
        this.isCreatingShipment = false;
      }
    });
  }

  shipOrder(): void {
    if (!this.salesOrder || !this.orderId) return;

    if (!confirm('Voulez-vous marquer cette commande comme expédiée ?')) {
      return;
    }

    this.shipmentApiService.shipOrder(this.orderId).subscribe({
      next: () => {
        alert('Commande expédiée avec succès');
        this.loadSalesOrder(this.orderId!);
      },
      error: (error) => {
        alert(`Erreur: ${error.message}`);
      }
    });
  }

  deliverOrder(): void {
    if (!this.salesOrder || !this.orderId) return;

    if (!confirm('Voulez-vous marquer cette commande comme livrée ?')) {
      return;
    }

    this.shipmentApiService.deliverOrder(this.orderId).subscribe({
      next: () => {
        alert('Commande marquée comme livrée');
        this.loadSalesOrder(this.orderId!);
      },
      error: (error) => {
        alert(`Erreur: ${error.message}`);
      }
    });
  }

  refresh(): void {
    if (this.orderId) {
      this.loadSalesOrder(this.orderId);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/sales-orders']);
  }

  canCreateShipment(): boolean {
    return this.salesOrder?.status === SalesOrderStatus.RESERVED && !this.salesOrder.shipment;
  }

  canShip(): boolean {
    return this.salesOrder?.status === SalesOrderStatus.RESERVED &&
      this.salesOrder?.shipment?.status === ShipmentStatus.PLANNED;
  }

  canDeliver(): boolean {
    return this.salesOrder?.status === SalesOrderStatus.SHIPPED &&
      this.salesOrder?.shipment?.status === ShipmentStatus.IN_TRANSIT;
  }

  getOrderTotal(): number {
    if (!this.salesOrder) return 0;
    return this.salesOrder.lines.reduce((sum, line) => sum + (line.price * line.quantity), 0);
  }

  getTotalItems(): number {
    if (!this.salesOrder) return 0;
    return this.salesOrder.lines.reduce((sum, line) => sum + line.quantity, 0);
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

  getShipmentStatusLabel(status: ShipmentStatus): string {
    const labels: { [key in ShipmentStatus]: string } = {
      [ShipmentStatus.PLANNED]: 'Planifié',
      [ShipmentStatus.IN_TRANSIT]: 'En transit',
      [ShipmentStatus.DELIVERED]: 'Livré',
      [ShipmentStatus.CANCELLED]: 'Annulé'
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

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}
