import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Supplier, SupplierCreateRequest} from '../../../../api/models/supplier.model';
import {SupplierApiService} from '../../../../api/services/supplier-api.service';

@Component({
  selector: 'app-supplier-form',
  standalone : true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.scss',
})
export class SupplierForm implements OnInit{
  supplierForm! : FormGroup;
  isLoading = false;
  errorMessage = '';
  fieldErrors: { [key: string]: string} = {};

  isEditMode = false;
  supplierId: number | null = null;
  currentSupplier: Supplier | null = null;

  constructor(private fb: FormBuilder, private supplierApiService: SupplierApiService, private router: Router, private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.supplierId = +params['id'];
        this.loadSupplier(this.supplierId)
      } else {
        this.initForm();
      }
    })
  }

  private initForm(supplier?: Supplier): void {
    this.supplierForm = this.fb.group({
      name: [supplier?.name || '', [Validators.required, Validators. minLength(3)]],
      contactPerson: [supplier?.contactPerson || ''],
      email: [supplier?. email || '', [Validators.required, Validators.email]],
      phone: [supplier?.phone || '']
    });
  }

  private loadSupplier(id: number): void {
    this.isLoading = true;
    this.supplierApiService.getSupplierById(id).subscribe({
      next: (supplier) => {
        this.currentSupplier = supplier;
        this.initForm(supplier);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement du fournisseur';
        this.isLoading = false;
      }
    });
  }

  get name() {
    return this.supplierForm.get('name');
  }

  get contactPerson() {
    return this.supplierForm.get('contactPerson');
  }

  get email() {
    return this.supplierForm.get('email');
  }

  get phone() {
    return this.supplierForm.get('phone');
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    // Vérifier la validation frontend
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const supplierData: SupplierCreateRequest = this.supplierForm.value;

    if (this.isEditMode && this.supplierId) {
      this.updateSupplier(this.supplierId, supplierData);
    } else {
      this.createSupplier(supplierData);
    }
  }

  private createSupplier(supplierDate: SupplierCreateRequest): void {
    this.supplierApiService.createSupplier(supplierDate).subscribe({
      next: (response) => {
        console.log('✅ Fournisseur créé:', response);
        alert(`Fournisseur "${response.name}" crée avec succès !`);
        this.router.navigate(['/admin/suppliers']);
      },
      error: (error) => {
        console.error('❌ Erreur création fournisseur:', error);
        this.handleError(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private updateSupplier(id: number, supplierData: SupplierCreateRequest): void {
    this.supplierApiService.updateSupplier(id, supplierData).subscribe({
      next: (response) => {
        console. log('✅ Fournisseur mis à jour:', response);
        alert(`Fournisseur "${response.name}" mis à jour avec succès !`);
        this.router.navigate(['/admin/suppliers']);
      },
      error: (error) => {
        console.error('❌ Erreur mise à jour fournisseur:', error);
        this.handleError(error);
        this.isLoading = false;
      },
      complete:  () => {
        this.isLoading = false;
      }
    });
  }

  private handleError(error: any): void {
    if (error.status === 400 && error.error?.errors) {
      this.fieldErrors = error.error.errors;
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      console.log('📋 Erreurs par champ:', this.fieldErrors);
    } else if (error.message.includes('email') || error.message.includes('409')) {
      this.errorMessage = 'Cet email est déjà utilisé.  Veuillez en choisir un autre.';
      this.fieldErrors = {email : 'Cet Email est déjà utilisé'};
    } else {
      this.errorMessage = error.message || `Une erreur est survenue lors de ${this.isEditMode ? 'la mise à jour' : 'la création'} du fournisseur.`;
    }
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.fieldErrors[fieldName];
  }

  getFieldError(fieldName: string): string {
    return this.fieldErrors[fieldName] || '';
  }

  cancel(): void {
    if (this.supplierForm.dirty) {
      const confirmed = confirm('Voulez-vous vraiment quitter sans sauvegarder ?');
      if (!confirmed) {
        return;
      }
    }
    this.router. navigate(['/admin/suppliers']);
  }
}
