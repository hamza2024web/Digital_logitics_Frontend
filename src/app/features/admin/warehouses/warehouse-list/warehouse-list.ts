import {Component, OnInit} from '@angular/core';
import {Warehouse} from '../../../../api/models/warehouse.model';
import {WarehouseApiService} from '../../../../api/models/warehouse-api.service';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [],
  templateUrl: './warehouse-list.html',
  styleUrl: './warehouse-list.scss',
})
export class WarehouseListComponent implements OnInit {
  warehouses: Warehouse[] = [];
  filteredWarehouses : Warehouse[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  constructor(private warehouseApiService: WarehouseApiService) {}

    ngOnInit(): void {
        this.loadWarehouses();
    }

  loadWarehouses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.warehouseApiService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
        this.filteredWarehouses = warehouses;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des entrepôts';
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredWarehouses = this.warehouses.filter(warehouse => {
      const matchesSearch = !this.searchTerm ||
        warehouse.code.toLowerCase().includes(this.searchTerm) ||
        warehouse.name.toLowerCase().includes(this.searchTerm);

      return matchesSearch;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filteredWarehouses = this.warehouses;
  }

  deleteWarehouse(warehouse: Warehouse): void {
    if (! confirm(`Voulez-vous vraiment supprimer l'entrepôt "${warehouse.name}" ?\nCette action est irréversible.`)) {
      return;
    }

    this.warehouseApiService. deleteWarehouse(warehouse.id).subscribe({
      next: () => {
        this.warehouses = this.warehouses.filter(w => w.id !== warehouse.id);
        this.applyFilters();
        alert('Entrepôt supprimé avec succès');
      },
      error: (error) => {
        alert(`Erreur lors de la suppression:  ${error.message}`);
      }
    });
  }
}
