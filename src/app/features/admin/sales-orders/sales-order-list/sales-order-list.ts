import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SalesOrder, SalesOrderStatus } from '../../../../api/models/sales-order.model';
import { ShipmentStatus } from '../../../../api/models/shipment.model';
import {SalesOrderApiService} from '../../../../api/services/sales-order-api.service';

@Component({
  selector: 'app-sales-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sales-order-list.html',
  styleUrl: './sales-order-list.scss',
})
export class SalesOrderList implements OnInit {
  salesOrders: SalesOrder[] = [];
  filteredOrders: SalesOrder[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  filterStatus: string = '';
  filterShipmentStatus: string = '';

  SalesOrderStatus = SalesOrderStatus;
  ShipmentStatus = ShipmentStatus;

  constructor(private salesOrderApiService: SalesOrderApiService) { }

  ngOnInit(): void {
    this.loadSalesOrders();
  }

  loadSalesOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.salesOrderApiService.getAllSalesOrders().subscribe({
      next: (orders: SalesOrder[]) => {
        this.salesOrders = orders;
        this.filteredOrders = orders;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des commandes';
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  onFilterStatus(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterStatus = select.value;
    this.applyFilters();
  }

  onFilterShipmentStatus(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterShipmentStatus = select.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredOrders = this.salesOrders.filter(order => {
      const matchesSearch = !this.searchTerm ||
        order.id.toString().includes(this.searchTerm) ||
        order.clientUsername.toLowerCase().includes(this.searchTerm) ||
        order.warehouseCode.toLowerCase().includes(this.searchTerm);

      const matchesStatus = !this.filterStatus || order.status === this.filterStatus;

      const matchesShipmentStatus = !this.filterShipmentStatus ||
        (order.shipment && order.shipment.status === this.filterShipmentStatus);

      return matchesSearch && matchesStatus && matchesShipmentStatus;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatus = '';
    this.filterShipmentStatus = '';
    this.filteredOrders = this.salesOrders;
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
