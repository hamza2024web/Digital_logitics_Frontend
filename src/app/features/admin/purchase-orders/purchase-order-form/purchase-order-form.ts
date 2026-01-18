import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Warehouse} from '../../../../api/models/warehouse.model';
import {Supplier} from '../../../../api/models/supplier.model';
import {Product} from '../../../../api/models/product.model';
import {Router} from '@angular/router';
import {ProductApiService} from '../../../../api/services/product-api.service';
import {WarehouseApiService} from '../../../../api/services/warehouse-api.service';
import {SupplierApiService} from '../../../../api/services/supplier-api.service';
import {PurchaseOrderApiService} from '../../../../api/services/purchase-order-api.model';
import {PurchaseOrderCreateRequest} from '../../../../api/models/purchse-order.model';

@Component({
  selector: 'app-purchase-order-form',
  imports: [],
  templateUrl: './purchase-order-form.html',
  styleUrl: './purchase-order-form.scss',
})
export class PurchaseOrderForm implements OnInit {
  orderForm! : FormGroup;
  isLoading = false;
  errorMessage = '';
  fieldErrors: { [key: string]: string} = {};

  suppliers: Supplier[] = [];
  warehouses: Warehouse[] = [];
  products: Product[] = [];

  isLoadingSuppliers = false;
  isLoadingWarehouses = false;
  isLoadingProducts = false;

  constructor(
    private fb: FormBuilder,
    private purchaseOrderApiService: PurchaseOrderApiService,
    private supplierApiService: SupplierApiService,
    private warehouseApiService: WarehouseApiService,
    private productApiService: ProductApiService,
    private router: Router
  ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadSuppliers();
        this.loadWarehouses();
        this.loadProducts();
    }

  private initForm(): void {
    this.orderForm = this.fb.group({
      supplierId:  [null, [Validators.required]],
      destinationWarehouseId: [null, [Validators.required]],
      lines: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    this.addLine();
  }

  private loadSuppliers(): void {
    this.isLoadingSuppliers = true;
    this.supplierApiService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.isLoadingSuppliers = false;
      },
      error:  (error) => {
        console.error('Erreur chargement suppliers:', error);
        this.isLoadingSuppliers = false;
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
        console.error('Erreur chargement warehouses:', error);
        this.isLoadingWarehouses = false;
      }
    });
  }

  private loadProducts(): void {
    this.isLoadingProducts = true;
    this.productApiService. getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoadingProducts = false;
      },
      error:  (error) => {
        console.error('Erreur chargement products:', error);
        this.isLoadingProducts = false;
      }
    });
  }

  get supplierId() {
    return this.orderForm.get('supplierId');
  }

  get destinationWarehouseId() {
    return this.orderForm.get('destinationWarehouseId');
  }

  get lines(): FormArray {
    return this.orderForm.get('lines') as FormArray;
  }

  addLine(): void {
    const lineGroup = this.fb.group({
      productId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    this.lines.push(lineGroup);
  }

  removeLine(index: number): void {
    if (this.lines.length > 1) {
      this.lines.removeAt(index);
    } else {
      alert('Un bon de commande doit contenir au moins une ligne');
    }
  }

  onProductSelected(index: number): void {
    const line = this.lines.at(index);
    const productId = line.get('productId')?.value;

    if (productId) {
      const product = this.products.find(p => p.id === productId);
      if (product) {
        line.get('price')?.setValue(product.price);
      }
    }
  }

  getLineTotal(index: number): number {
    const line = this.lines.at(index);
    const quantity = line.get('quantity')?.value || 0;
    const price = line. get('price')?.value || 0;
    return quantity * price;
  }

  getGrandTotal(): number {
    let total = 0;
    for (let i = 0; i < this.lines.length; i++) {
      total += this.getLineTotal(i);
    }
    return total;
  }

  getProductName(productId: number): string {
    const product = this. products.find(p => p. id === productId);
    return product ? product.name : '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.markAllLinesAsTouched();
      return;
    }

    this.isLoading = true;

    const orderData: PurchaseOrderCreateRequest = {
      supplierId: this.orderForm.value.supplierId,
      destinationWarehouseId: this.orderForm.value. destinationWarehouseId,
      lines: this.orderForm.value.lines
    };

    this.purchaseOrderApiService.createPurchaseOrder(orderData).subscribe({
      next: (response) => {
        console.log('✅ Bon de commande créé:', response);
        alert(`Bon de commande #${response.id} créé avec succès ! `);
        this.router.navigate(['/admin/purchase-orders']);
      },
      error: (error) => {
        console.error('❌ Erreur création bon de commande:', error);
        this.handleError(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private markAllLinesAsTouched(): void {
    this.lines.controls.forEach(line => {
      line.markAllAsTouched();
    });
  }

  private handleError(error: any): void {
    if (error.status === 400 && error.error?. errors) {
      this.fieldErrors = error.error. errors;
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire. ';
    } else {
      this.errorMessage = error.message || 'Une erreur est survenue lors de la création du bon de commande.';
    }
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.fieldErrors[fieldName];
  }

  getFieldError(fieldName: string): string {
    return this.fieldErrors[fieldName] || '';
  }

  cancel(): void {
    if (this.orderForm.dirty) {
      const confirmed = confirm('Voulez-vous vraiment quitter sans sauvegarder ?');
      if (!confirmed) {
        return;
      }
    }
    this.router. navigate(['/admin/purchase-orders']);
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}
