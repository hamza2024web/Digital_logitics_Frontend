import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../api/models/product.model';
import { Warehouse } from '../../../api/models/warehouse.model';
import { InventoryApiService } from '../../../api/services/inventory-api.service';
import { ProductApiService } from '../../../api/services/product-api.service';
import { WarehouseApiService } from '../../../api/services/warehouse-api.service';
import { Router, RouterLink } from '@angular/router';
import { AdjustmentRequest } from '../../../api/models/inventory.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-adjustment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stock-adjustment.html',
  styleUrl: './stock-adjustment.scss',
})
export class StockAdjustment implements OnInit {
  adjustmentForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  products: Product[] = [];
  warehouses: Warehouse[] = [];

  adjustmentTypes = [
    { value: 'add', label: 'Ajouter du stock', icon: '➕' },
    { value: 'remove', label: 'Retirer du stock', icon: '➖' }
  ];

  constructor(
    private fb: FormBuilder,
    private inventoryApiService: InventoryApiService,
    private productApiService: ProductApiService,
    private warehouseApiService: WarehouseApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadWarehouses();
  }

  private initForm(): void {
    this.adjustmentForm = this.fb.group({
      productId: [null, [Validators.required]],
      warehouseId: [null, [Validators.required]],
      adjustmentType: ['add', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  private loadProducts(): void {
    this.productApiService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Erreur chargement produits:', error);
      }
    });
  }

  private loadWarehouses(): void {
    this.warehouseApiService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
      },
      error: (error) => {
        console.error('Erreur chargement entrepôts:', error);
      }
    });
  }

  get productId() {
    return this.adjustmentForm.get('productId');
  }

  get warehouseId() {
    return this.adjustmentForm.get('warehouseId');
  }

  get adjustmentType() {
    return this.adjustmentForm.get('adjustmentType');
  }

  get quantity() {
    return this.adjustmentForm.get('quantity');
  }

  get reason() {
    return this.adjustmentForm.get('reason');
  }

  onSubmit(): void {
    if (this.adjustmentForm.invalid) {
      this.adjustmentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.adjustmentForm.value;

    // Calculer la quantité (négative si retrait)
    const finalQuantity = formValue.adjustmentType === 'add'
      ? formValue.quantity
      : -formValue.quantity;

    const adjustmentData: AdjustmentRequest = {
      productId: formValue.productId,
      warehouseId: formValue.warehouseId,
      quantity: finalQuantity,
      reason: formValue.reason
    };

    this.inventoryApiService.recordAdjustment(adjustmentData).subscribe({
      next: (inventory) => {
        alert(`Ajustement enregistré avec succès !  \nNouveau stock: ${inventory.qtyOnHand} unités`);
        this.router.navigate(['/warehouse-manager/inventory']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors de l\'ajustement';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    if (this.adjustmentForm.dirty) {
      if (!confirm('Voulez-vous vraiment quitter sans sauvegarder ?')) {
        return;
      }
    }
    this.router.navigate(['/warehouse-manager/inventory']);
  }
}
