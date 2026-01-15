import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ProductApiService } from '../../../../api/services/product-api.service';
import { Product, ProductCreateRequest } from '../../../../api/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductFormComponent implements OnInit {
  productForm! : FormGroup;
  isLoading = false;
  errorMessage = '';
  fieldErrors: { [key: string]:  string } = {};

  isEditMode = false;
  productId: number | null = null;
  currentProduct: Product | null = null;

  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productApiService: ProductApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this. loadProduct(this.productId);
      } else {
        this.initForm();
      }
    });
  }

  private initForm(product?: Product): void {
    this.productForm = this.fb.group({
      sku: [product?.sku || '', [Validators.required, Validators.minLength(2)]],
      name: [product?.name || '', [Validators.required, Validators.minLength(3)]],
      image: [product?.image || ''],
      price: [product?. price || 0, [Validators.required, Validators.min(0)]],
      active: [product?.active !== undefined ? product.active : true]
    });

    if (product?. image) {
      this.imagePreview = product.image;
    }
  }

  private loadProduct(id: number): void {
    this.isLoading = true;
    this.productApiService.getProductById(id).subscribe({
      next: (product) => {
        this.currentProduct = product;
        this.initForm(product);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement du produit';
        this. isLoading = false;
      }
    });
  }

  get sku() {
    return this.productForm. get('sku');
  }

  get name() {
    return this.productForm.get('name');
  }

  get image() {
    return this.productForm.get('image');
  }

  get price() {
    return this.productForm. get('price');
  }

  get active() {
    return this.productForm.get('active');
  }

  onImageUrlChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const url = input.value;

    if (url && this.isValidImageUrl(url)) {
      this.imagePreview = url;
    } else {
      this. imagePreview = null;
    }
  }

  private isValidImageUrl(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  }

  onImageError(): void {
    this.imagePreview = null;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const productData: ProductCreateRequest = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.updateProduct(this.productId, productData);
    } else {
      this.createProduct(productData);
    }
  }

  private createProduct(productData: ProductCreateRequest): void {
    this.productApiService.createProduct(productData).subscribe({
      next: (response) => {
        console.log('✅ Produit créé:', response);
        alert(`Produit "${response.name}" créé avec succès ! `);
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        console.error('❌ Erreur création produit:', error);
        this.handleError(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private updateProduct(id: number, productData: ProductCreateRequest): void {
    this.productApiService. updateProduct(id, productData).subscribe({
      next: (response) => {
        console.log('✅ Produit mis à jour:', response);
        alert(`Produit "${response.name}" mis à jour avec succès ! `);
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        console.error('❌ Erreur mise à jour produit:', error);
        this.handleError(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleError(error: any): void {
    if (error.status === 400 && error.error?. errors) {
      this.fieldErrors = error.error. errors;
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire. ';
      console.log('📋 Erreurs par champ:', this.fieldErrors);
    }
    else if (error.message. includes('SKU') || error.message.includes('409')) {
      this.errorMessage = 'Ce SKU est déjà utilisé.  Veuillez en choisir un autre.';
      this.fieldErrors = { sku: 'Ce SKU est déjà utilisé' };
    }
    else {
      this.errorMessage = error.message || `Une erreur est survenue lors de ${this.isEditMode ? 'la mise à jour' : 'la création'} du produit.`;
    }
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.fieldErrors[fieldName];
  }

  getFieldError(fieldName:  string): string {
    return this.fieldErrors[fieldName] || '';
  }

  cancel(): void {
    if (this.productForm.dirty) {
      const confirmed = confirm('Voulez-vous vraiment quitter sans sauvegarder ?');
      if (! confirmed) {
        return;
      }
    }
    this.router. navigate(['/admin/products']);
  }
}
