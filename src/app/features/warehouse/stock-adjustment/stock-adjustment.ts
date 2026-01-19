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
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './stock-adjustment.html',
  styleUrl: './stock-adjustment.scss',
})
export class StockAdjustment implements OnInit {
  adjustmentForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  products: Product[] = [];
  warehouses: Warehouse[] = [];

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
      productId: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
      type: ['IN', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      reason: ['', [Validators.required]],
      notes: ['']
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

  getQuantity(): number {
    return this.adjustmentForm.get('quantity')?.value || 0;
  }

  incrementQuantity(): void {
    const current = this.getQuantity();
    this.adjustmentForm.patchValue({ quantity: current + 1 });
  }

  decrementQuantity(): void {
    const current = this.getQuantity();
    if (current > 1) {
      this.adjustmentForm.patchValue({ quantity: current - 1 });
    }
  }

  resetForm(): void {
    if (this.adjustmentForm.dirty) {
      if (!confirm('Voulez-vous vraiment réinitialiser le formulaire ?')) {
        return;
      }
    }
    this.adjustmentForm.reset({
      productId: '',
      warehouseId: '',
      type: 'IN',
      quantity: 1,
      reason: '',
      notes: ''
    });
  }

  submitAdjustment(): void {
    if (this.adjustmentForm.invalid) {
      this.adjustmentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.adjustmentForm.value;

    // Calculer la quantité (négative si sortie)
    const finalQuantity = formValue.type === 'IN'
      ? formValue.quantity
      : -formValue.quantity;

    const adjustmentData: AdjustmentRequest = {
      productId: formValue.productId,
      warehouseId: formValue.warehouseId,
      quantity: finalQuantity,
      reason: `${formValue.reason}${formValue.notes ? ': ' + formValue.notes : ''}`
    };

    this.inventoryApiService.recordAdjustment(adjustmentData).subscribe({
      next: (inventory) => {
        alert(`Ajustement enregistré avec succès !\nNouveau stock: ${inventory.qtyOnHand} unités`);
        this.router.navigate(['/warehouse/dashboard/inventory']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors de l\'ajustement';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    if (this.adjustmentForm.dirty) {
      if (!confirm('Voulez-vous vraiment quitter sans sauvegarder ?')) {
        return;
      }
    }
    this.router.navigate(['/warehouse/dashboard/inventory']);
  }
}
