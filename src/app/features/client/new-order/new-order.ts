import { Component } from '@angular/core';
import {SalesOrderCreateRequest} from '../../../api/models/sales-order.model';
import {Product} from '../../../api/models/product.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {WarehouseApiService} from '../../../api/services/warehouse-api.service';
import {ProductApiService} from '../../../api/services/product-api.service';
import {ClientOrderApiService} from '../../../api/services/SalesOrder-api.service';
import {Warehouse} from '../../../api/models/warehouse.model';

@Component({
  selector: 'app-new-order',
  imports: [],
  templateUrl: './new-order.html',
  styleUrl: './new-order.scss',
})
export class NewOrder {
  orderForm! : FormGroup;
  isLoading = false;
  errorMessage = '';

  // Listes
  products: Product[] = [];
  warehouses: Warehouse[] = [];

  // Loading
  isLoadingProducts = false;
  isLoadingWarehouses = false;

  constructor(
    private fb: FormBuilder,
    private clientOrderApiService: ClientOrderApiService,
    private productApiService:  ProductApiService,
    private warehouseApiService: WarehouseApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadWarehouses();
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      warehouseId: [null, [Validators.required]],
      lines: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    this.addLine();
  }

  private loadProducts(): void {
    this.isLoadingProducts = true;
    this.productApiService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products. filter(p => p.active);
        this.isLoadingProducts = false;
      },
      error:  (error) => {
        console.error('Erreur chargement produits:', error);
        this.isLoadingProducts = false;
      }
    });
  }

  private loadWarehouses(): void {
    this.isLoadingWarehouses = true;
    this.warehouseApiService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
        this.isLoadingWarehouses = false;
      },
      error: (error) => {
        console.error('Erreur chargement entrepôts:', error);
        this.isLoadingWarehouses = false;
      }
    });
  }

  get warehouseId() {
    return this.orderForm.get('warehouseId');
  }

  get lines(): FormArray {
    return this. orderForm.get('lines') as FormArray;
  }

  addLine(): void {
    const lineGroup = this.fb.group({
      productId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.lines.push(lineGroup);
  }

  removeLine(index: number): void {
    if (this.lines.length > 1) {
      this.lines.removeAt(index);
    } else {
      alert('Une commande doit contenir au moins une ligne');
    }
  }

  getSelectedProduct(index: number): Product | undefined {
    const line = this.lines.at(index);
    const productId = line. get('productId')?.value;
    return this.products.find(p => p.id === productId);
  }

  getLineTotal(index: number): number {
    const product = this.getSelectedProduct(index);
    const quantity = this.lines.at(index).get('quantity')?.value || 0;
    return product ?  product.price * quantity : 0;
  }

  getGrandTotal(): number {
    let total = 0;
    for (let i = 0; i < this.lines.length; i++) {
      total += this.getLineTotal(i);
    }
    return total;
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.markAllLinesAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const orderData: SalesOrderCreateRequest = {
      warehouseId: this.orderForm.value.warehouseId,
      lines: this.orderForm.value.lines
    };

    this.clientOrderApiService.createOrder(orderData).subscribe({
      next: (response) => {
        alert(`Commande #${response.id} créée avec succès !\nVoulez-vous réserver le stock maintenant ? `);

        // Proposer de réserver directement
        if (confirm('Réserver le stock maintenant ?')) {
          this.reserveStock(response.id);
        } else {
          this.router.navigate(['/client/orders']);
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors de la création de la commande';
        this.isLoading = false;
      }
    });
  }

  private reserveStock(orderId: number): void {
    this.clientOrderApiService.reserveOrderStock(orderId).subscribe({
      next: () => {
        alert('Stock réservé avec succès !');
        this.router.navigate(['/client/orders', orderId]);
      },
      error: (error) => {
        alert(`Commande créée mais erreur lors de la réservation:  ${error.message}`);
        this.router.navigate(['/client/orders', orderId]);
      }
    });
  }

  private markAllLinesAsTouched(): void {
    this.lines. controls.forEach(line => {
      line.markAllAsTouched();
    });
  }

  cancel(): void {
    if (this.orderForm.dirty) {
      if (!confirm('Voulez-vous vraiment quitter sans sauvegarder ?')) {
        return;
      }
    }
    this.router.navigate(['/client/orders']);
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}
