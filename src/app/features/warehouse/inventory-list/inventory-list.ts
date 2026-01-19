import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../api/models/inventory.model';
import { InventoryApiService } from '../../../api/services/inventory-api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss',
})
export class InventoryList implements OnInit {
  inventories: Inventory[] = [];
  filteredInventories: Inventory[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  filterStockLevel: string = '';

  constructor(private inventoryApiService: InventoryApiService) { }

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.inventoryApiService.getAllInventories().subscribe({
      next: (inventories) => {
        this.inventories = inventories;
        this.filteredInventories = inventories;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des stocks';
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  onFilterStockLevel(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterStockLevel = select.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredInventories = this.inventories.filter(inventory => {
      const matchesSearch = !this.searchTerm ||
        inventory.productSku.toLowerCase().includes(this.searchTerm) ||
        inventory.warehouseCode.toLowerCase().includes(this.searchTerm);

      const available = this.getAvailableQty(inventory);
      let matchesStockLevel = true;

      if (this.filterStockLevel === 'critical') {
        matchesStockLevel = available < 5;
      } else if (this.filterStockLevel === 'low') {
        matchesStockLevel = available >= 5 && available < 10;
      } else if (this.filterStockLevel === 'ok') {
        matchesStockLevel = available >= 10;
      }

      return matchesSearch && matchesStockLevel;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStockLevel = '';
    this.filteredInventories = this.inventories;
  }

  getAvailableQty(inventory: Inventory): number {
    return inventory.qtyOnHand - inventory.qtyReserved;
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

  getReservedPercentage(inventory: Inventory): number {
    if (inventory.qtyOnHand === 0) return 0;
    return (inventory.qtyReserved / inventory.qtyOnHand) * 100;
  }
}
