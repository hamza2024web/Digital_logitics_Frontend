import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductApiService } from '../../../../api/services/product-api.service';
import { Product } from '../../../../api/models/product.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products-list. component.html',
  styleUrls: ['./products-list. component.scss']
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  filterActive: string = '';
  filterPrice: number | null = null;

  constructor(private productApiService: ProductApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productApiService. getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.isLoading = false;
      },
      error:  (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des produits';
        this.isLoading = false;
      }
    });
  }

  onSearch(event:  Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  onFilterStatus(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterActive = select.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm ||
        product.sku. toLowerCase().includes(this.searchTerm) ||
        product.name.toLowerCase().includes(this.searchTerm);

      const matchesStatus = ! this.filterActive ||
        (this.filterActive === 'active' && product.active) ||
        (this.filterActive === 'inactive' && !product.active);

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterActive = '';
    this.filterPrice = null;
    this.filteredProducts = this. products;
  }

  toggleProductStatus(product: Product): void {
    const action = product.active ? 'désactiver' : 'activer';

    if (!confirm(`Voulez-vous vraiment ${action} le produit ${product.name} ? `)) {
      return;
    }

    this.productApiService.toggleProductStatus(product. id, !product.active).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.id === updatedProduct. id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        this.applyFilters();
        alert(`Produit ${action} avec succès`);
      },
      error: (error) => {
        alert(`Erreur lors de la modification: ${error.message}`);
      }
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Voulez-vous vraiment supprimer le produit ${product.name} ?\nCette action est irréversible.`)) {
      return;
    }

    this.productApiService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== product.id);
        this.applyFilters();
        alert('Produit supprimé avec succès');
      },
      error: (error) => {
        alert(`Erreur lors de la suppression:  ${error.message}`);
      }
    });
  }

  getStatusBadgeClass(active: boolean): string {
    return active ? 'status-active' : 'status-inactive';
  }

  getStatusLabel(active: boolean): string {
    return active ? 'Actif' : 'Inactif';
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}
