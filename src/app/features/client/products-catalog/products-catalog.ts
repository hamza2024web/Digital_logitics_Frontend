import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {Store} from '@ngrx/store';
import {
  selectError,
  selectItems,
  selectLoading,
  selectQuery,
  selectTotalElements, selectTotalPages
} from '../../../store/products/products.selectors';
import {ProductsActions} from '../../../store/products/product.actions';

@Component({
  selector: 'app-products-catalog',
  imports: [CommonModule, RouterLink],
  templateUrl: './products-catalog.html',
  styleUrl: './products-catalog.scss',
  standalone: true,
})
export class ProductsCatalog implements OnInit {
  private store = inject(Store);

  products$ = this.store.select(selectItems);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  query$ = this.store.select(selectQuery);
  totalElements$ = this.store.select(selectTotalElements);
  totalPages = this.store.select(selectTotalPages);

  categories = ['Electronics','Home','Fashion','Sports'];

  ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadProducts({
      query: { page: 0, size: 10, active: true}
    }));
  }

  onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;

    this.store.dispatch(ProductsActions.setQuery({
      partialQuery: { search, page:0 }
    }));
  }

  onCategoryChange(event: Event): void {
    const category = (event.target as HTMLSelectElement).value;

    this.store.dispatch(ProductsActions.setQuery({
      partialQuery: { category: category || undefined, page: 0}
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

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}
