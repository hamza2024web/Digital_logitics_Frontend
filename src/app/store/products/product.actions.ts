import {ProductQuery, ProductResponse} from '../../api/models/product.model';
import {createActionGroup, props} from '@ngrx/store';

export const ProductActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': props<{ query: ProductQuery }>(),
    'Load Products Success': props<{ response: ProductResponse}>(),
    'Load Products Failure': props<{ error:any }>(),
    'Set Query': props<{ partialQuery : Partial<ProductQuery> }>(),
  }
});
