import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductApiService } from '../../../../api/services/product-api.service';
import { Product } from '../../../../api/models/product.model';
import {Store} from '@ngrx/store';
import {
  selectError,
  selectItems,
  selectLoading,
  selectQuery,
  selectTotalElements, selectTotalPages
} from '../../../../store/products/products.selectors';
import {ProductsActions} from '../../../../store/products/product.actions';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.scss']
})
export class ProductsListComponent implements OnInit {
  private store = inject(Store);
  private productApiService = inject(ProductApiService);

  products$ = this.store.select(selectItems);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  query$ = this.store.select(selectQuery);
  totalElements$ = this.store.select(selectTotalElements);
  totalPages$ = this.store.select(selectTotalPages);


  ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadProducts({
      query: { page: 0, size: 10, active: undefined as any}
    }));
  }

  onSearch(event:  Event): void {
    const search = (event.target as HTMLInputElement).value;

    this.store.dispatch(ProductsActions.setQuery({
      partialQuery: { search, page:0 }
    }));
  }

  onFilterStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const active = value === '' ? undefined : (value === 'active');

    this.store.dispatch(ProductsActions.setQuery({
      partialQuery: { active, page: 0}
    }));
  }

  onPageChange(page: number): void {
    this.store.dispatch(ProductsActions.setQuery({
      partialQuery: { page }
    }));
  }

  onSizeChange(event: Event): void {
    const size = parseInt((event.target as HTMLSelectElement).value, 10);
    this.store.dispatch(ProductsActions.setQuery({
      partialQuery: { size, page:0 }
    }));
  }

  onSort(field: string): void {
    this.store.dispatch(ProductsActions.setQuery({
      partialQuery: { sort: `${field},asc`, page:0 }
    }));
  }


  toggleProductStatus(product: Product): void {
    const action = product.active ? 'désactiver' : 'activer';
    if (!confirm(`Voulez-vous vraiment ${action} le produit ${product.name} ?`)) return;

    this.productApiService.toggleProductStatus(product.id, !product.active).subscribe({
      next: () => {
        this.store.dispatch(ProductsActions.loadProducts({ query: {} as any }));
        alert(`Produit ${action} avec succès`);
      },
      error: (error) => alert(`Erreur: ${error.message}`)
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Voulez-vous vraiment supprimer ${product.name} ?`)) return;

    this.productApiService.deleteProduct(product.id).subscribe({
      next: () => {
        this.store.dispatch(ProductsActions.loadProducts({ query: {} as any }));
        alert('Produit supprimé');
      },
      error: (error) => alert(`Erreur: ${error.message}`)
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
