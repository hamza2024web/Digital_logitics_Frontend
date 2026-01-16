import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Supplier} from '../../../../api/models/supplier.model';
import {SupplierApiService} from '../../../../api/services/supplier-api.service';

@Component({
  selector: 'app-supplier-list',
  standalone : true,
  imports: [CommonModule, RouterLink],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.scss',
})
export class SupplierList implements OnInit {
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  constructor(private supplierApiService : SupplierApiService ) {}

    ngOnInit(): void {
        this.loadSuppliers();
    }

  loadSuppliers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.supplierApiService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.filteredSuppliers = suppliers;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des fournisseurs';
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredSuppliers = this.suppliers.filter(supplier => {
      const matchesSearch = ! this.searchTerm ||
        supplier.name.toLowerCase().includes(this.searchTerm) ||
        supplier.email.toLowerCase().includes(this.searchTerm) ||
        (supplier.contactPerson && supplier. contactPerson.toLowerCase().includes(this.searchTerm));

      return matchesSearch;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filteredSuppliers = this.suppliers;
  }

  deleteSupplier(supplier: Supplier): void {
    if (! confirm(`Voulez-vous vraiment supprimer le fournisseur "${supplier.name}" ?\nCette action est irréversible. `)) {
      return;
    }

    this.supplierApiService.deleteSupplier(supplier.id).subscribe({
      next: () => {
        this.suppliers = this.suppliers. filter(s => s.id !== supplier.id);
        this.applyFilters();
        alert('Fournisseur supprimé avec succès');
      },
      error: (error) => {
        alert(`Erreur lors de la suppression: ${error.message}`);
      }
    });
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return 'Non renseigné';
    return phone;
  }
}
