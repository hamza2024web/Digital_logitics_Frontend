import { createFeature, createReducer, on } from '@ngrx/store';
import { Product } from '../../api/models/product.model';
import { ProductsActions } from './product.actions';

export interface ProductState {
  items: Product[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: any;
  query: {
    page: number,
    size: number,
    sort?: string,
    search?: string,
    category?: string,
    active: boolean
  };
}

const initialState: ProductState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null,
  query: { page: 0, size: 10, active: true }
};

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialState,
    on(ProductsActions.setQuery, (state, { partialQuery }) => ({
      ...state,
      query: { ...state.query, ...partialQuery }
    })),
    on(ProductsActions.loadProducts, (state, { query }) => ({
      ...state,
      query: { ...state.query, ...query},
      loading: true,
      error: null
    })),
    on(ProductsActions.loadProductsSuccess, (state, { response }) => ({
      ...state,
      items: response.items,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      loading: false
    })),
    on(ProductsActions.loadProductsFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false
    }))
  )
});

