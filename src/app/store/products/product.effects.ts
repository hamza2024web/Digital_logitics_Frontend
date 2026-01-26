import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {ProductApiService} from '../../api/services/product-api.service';
import {Store} from '@ngrx/store';
import {ProductsActions} from './product.actions';
import {selectQuery} from './products.selectors';
import {concatLatestFrom} from '@ngrx/operators';
import {catchError, map, of, switchMap} from 'rxjs';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductApiService);
  private store = inject(Store);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts, ProductsActions.setQuery),
      concatLatestFrom(() => this.store.select(selectQuery)),
      switchMap(([action, query]) =>
        this.productService.list(query).pipe(
          map(response => ProductsActions.loadProductsSuccess({ response })),
          catchError(error => of(ProductsActions.loadProductsFailure({ error })))
        )
      )
    )
  )
}
