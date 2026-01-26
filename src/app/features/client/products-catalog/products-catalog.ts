import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductApiService } from '../../../api/services/product-api.service';
import { Product } from '../../../api/models/product.model';

@Component({
  selector: 'app-products-catalog',
  imports: [CommonModule, RouterLink],
  templateUrl: './products-catalog.html',
  styleUrl: './products-catalog.scss',
})
export class ProductsCatalog implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  sortBy: string = 'name';

  constructor(private productApiService: ProductApiService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productApiService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        // Filtrer uniquement les produits actifs
        this.products = products.filter(p => p.active);
        this.filteredProducts = this.products;
        this.applySorting();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des produits';
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  onSort(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value;
    this.applySorting();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      return !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm) ||
        product.sku.toLowerCase().includes(this.searchTerm);
    });
    this.applySorting();
  }

  applySorting(): void {
    switch (this.sortBy) {
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.sortBy = 'name';
    this.filteredProducts = this.products;
    this.applySorting();
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}
