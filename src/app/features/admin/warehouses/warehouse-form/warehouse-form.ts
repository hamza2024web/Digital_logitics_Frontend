import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Warehouse, WarehouseCreateRequest } from '../../../../api/models/warehouse.model';
import {WarehouseApiService} from '../../../../api/models/warehouse-api.service';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './warehouse-form.html',
  styleUrls:  ['./warehouse-form.scss']
})
export class WarehouseFormComponent implements OnInit {
  warehouseForm! : FormGroup;
  isLoading = false;
  errorMessage = '';
  fieldErrors: { [key: string]: string } = {};

  // Mode édition ou création
  isEditMode = false;
  warehouseId:  number | null = null;
  currentWarehouse: Warehouse | null = null;

  constructor(
    private fb: FormBuilder,
    private warehouseApiService: WarehouseApiService,
    private router: Router,
    private route:  ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.warehouseId = +params['id'];
        this. loadWarehouse(this.warehouseId);
      } else {
        this.initForm();
      }
    });
  }

  private initForm(warehouse?: Warehouse): void {
    this.warehouseForm = this.fb.group({
      code: [warehouse?. code || '', [Validators.required, Validators.minLength(2)]],
      name: [warehouse?.name || '', [Validators.required, Validators. minLength(3)]]
    });
  }

  private loadWarehouse(id: number): void {
    this.isLoading = true;
    this. warehouseApiService.getWarehouseById(id).subscribe({
      next: (warehouse) => {
        this.currentWarehouse = warehouse;
        this.initForm(warehouse);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement de l\'entrepôt';
        this.isLoading = false;
      }
    });
  }

  get code() {
    return this.warehouseForm.get('code');
  }

  get name() {
    return this.warehouseForm.get('name');
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    if (this.warehouseForm.invalid) {
      this.warehouseForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const warehouseData: WarehouseCreateRequest = this.warehouseForm.value;

    if (this.isEditMode && this.warehouseId) {
      this.updateWarehouse(this.warehouseId, warehouseData);
    } else {
      this.createWarehouse(warehouseData);
    }
  }

  private createWarehouse(warehouseData: WarehouseCreateRequest): void {
    this.warehouseApiService.createWarehouse(warehouseData).subscribe({
      next: (response) => {
        console.log('✅ Entrepôt créé:', response);
        alert(`Entrepôt "${response.name}" créé avec succès !`);
        this.router.navigate(['/admin/warehouses']);
      },
      error: (error) => {
        console.error('❌ Erreur création entrepôt:', error);
        this.handleError(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private updateWarehouse(id:  number, warehouseData: WarehouseCreateRequest): void {
    this.warehouseApiService.updateWarehouse(id, warehouseData).subscribe({
      next: (response) => {
        console.log('✅ Entrepôt mis à jour:', response);
        alert(`Entrepôt "${response. name}" mis à jour avec succès !`);
        this.router.navigate(['/admin/warehouses']);
      },
      error:  (error) => {
        console.error('❌ Erreur mise à jour entrepôt:', error);
        this.handleError(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleError(error: any): void {
    if (error.status === 400 && error.error?.errors) {
      this.fieldErrors = error.error. errors;
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire. ';
      console.log('📋 Erreurs par champ:', this.fieldErrors);
    }
    else if (error.message. includes('code') || error.message.includes('409')) {
      this.errorMessage = 'Ce code d\'entrepôt est déjà utilisé.  Veuillez en choisir un autre.';
      this.fieldErrors = { code: 'Ce code est déjà utilisé' };
    }
    else {
      this.errorMessage = error.message || `Une erreur est survenue lors de ${this.isEditMode ? 'la mise à jour' : 'la création'} de l'entrepôt.`;
    }
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.fieldErrors[fieldName];
  }

  getFieldError(fieldName:  string): string {
    return this.fieldErrors[fieldName] || '';
  }

  cancel(): void {
    if (this.warehouseForm.dirty) {
      const confirmed = confirm('Voulez-vous vraiment quitter sans sauvegarder ?');
      if (! confirmed) {
        return;
      }
    }
    this.router. navigate(['/admin/warehouses']);
  }
}
