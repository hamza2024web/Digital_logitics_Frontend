import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { Inventory } from '../../../../api/models/inventory.model';
import { PurchaseOrder, PurchaseOrderStatus } from '../../../../api/models/purchse-order.model';
import { InventoryApiService } from '../../../../api/services/inventory-api.service';
import { PurchaseOrderApiService } from '../../../../api/services/purchase-order-api.model';

@Component({
  selector: 'app-warehouse-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './warehouse-dashboard.html',
  styleUrl: './warehouse-dashboard.scss'
})
export class WarehouseDashboardComponent implements OnInit {
  inventories: Inventory[] = [];
  pendingPurchaseOrders: PurchaseOrder[] = [];

  isLoadingInventories = false;
  isLoadingOrders = false;

  sidebarCollapsed = false;
  userName = 'John Doe';
  currentDate = new Date();

  stats = {
    totalItems: 0,
    totalStock: 0,
    totalReserved: 0,
    lowStockAlerts: 0,
    pendingOrders: 0,
    inboundToday: 0,
    outboundToday: 0,
    capacityUsed: 0
  };

  constructor(
    private inventoryApiService: InventoryApiService,
    private purchaseOrderApiService: PurchaseOrderApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get user name from auth service if available
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = `${user.firstName} ${user.lastName}`;
    }
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadInventories();
    this.loadPendingOrders();
  }

  loadInventories(): void {
    this.isLoadingInventories = true;

    this.inventoryApiService.getAllInventories().subscribe({
      next: (inventories) => {
        this.inventories = inventories;
        this.calculateStats();
        this.isLoadingInventories = false;
      },
      error: (error) => {
        console.error('Erreur chargement stocks:', error);
        this.isLoadingInventories = false;
      }
    });
  }

  loadPendingOrders(): void {
    this.isLoadingOrders = true;

    this.purchaseOrderApiService.getAllPurchaseOrders().subscribe({
      next: (orders) => {
        this.pendingPurchaseOrders = orders.filter(
          order => order.status === PurchaseOrderStatus.RECEIVED
        );
        this.stats.pendingOrders = this.pendingPurchaseOrders.length;
        this.isLoadingOrders = false;
      },
      error: (error) => {
        console.error('Erreur chargement commandes:', error);
        this.isLoadingOrders = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.totalItems = this.inventories.length;
    this.stats.totalStock = this.inventories.reduce((sum, inv) => sum + inv.qtyOnHand, 0);
    this.stats.totalReserved = this.inventories.reduce((sum, inv) => sum + inv.qtyReserved, 0);

    // Produits avec stock faible (< 10 unités disponibles)
    this.stats.lowStockAlerts = this.inventories.filter(inv =>
      (inv.qtyOnHand - inv.qtyReserved) < 10
    ).length;

    // Mock values for missing data
    this.stats.inboundToday = 12;
    this.stats.outboundToday = 8;
    this.stats.capacityUsed = 75;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getAvailableQty(inventory: Inventory): number {
    return inventory.qtyOnHand - inventory.qtyReserved;
  }

  isLowStock(inventory: Inventory): boolean {
    return this.getAvailableQty(inventory) < 10;
  }

  isCriticalStock(inventory: Inventory): boolean {
    return this.getAvailableQty(inventory) < 5;
  }

  getStockBadgeClass(inventory: Inventory): string {
    const available = this.getAvailableQty(inventory);
    if (available === 0) return 'stock-empty';
    if (available < 5) return 'stock-critical';
    if (available < 10) return 'stock-low';
    return 'stock-ok';
  }

  getStockLabel(inventory: Inventory): string {
    const available = this.getAvailableQty(inventory);
    if (available === 0) return 'Rupture';
    if (available < 5) return 'Critique';
    if (available < 10) return 'Bas';
    return 'Normal';
  }

  refresh(): void {
    this.loadDashboardData();
  }
}
