// src/app/features/admin/users/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserApiService } from '../../../../api/services/user-api.service';
import {AdminUserCreateDTO} from '../../../../api/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss']
})
export class UserFormComponent implements OnInit {
  userForm! : FormGroup;
  isLoading = false;
  errorMessage = '';

  roles = [
    { value: 'CLIENT', label: 'Client' },
    { value: 'WAREHOUSE_MANAGER', label: 'Gestionnaire d\'entrepôt' },
    { value:  'ADMIN', label: 'Administrateur' }
  ];

  constructor(
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators. minLength(2)]],
      lastName: ['', [Validators. required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['CLIENT', [Validators.required]]
    });
  }

  get firstName() {
    return this.userForm. get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

  get role() {
    return this.userForm.get('role');
  }

  onSubmit(): void {
    this. errorMessage = '';

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const userData: AdminUserCreateDTO = this.userForm.value;

    this.userApiService.createUser(userData).subscribe({
      next: (response) => {
        console.log('✅ Utilisateur créé:', response);

        alert(`Utilisateur ${response.firstName} ${response.lastName} créé avec succès ! `);

        this.router.navigate(['/admin/users']);
      },
      error: (error) => {
        console.error('❌ Erreur création utilisateur:', error);

        if (error.message.includes('Email Exist')) {
          this.errorMessage = 'Cet email est déjà utilisé.  Veuillez en choisir un autre.';
        } else if (error.message.includes('Données Invalides')) {
          this.errorMessage = 'Les données saisies sont invalides. Veuillez vérifier le formulaire.';
        } else {
          this.errorMessage = error.message || 'Une erreur est survenue lors de la création de l\'utilisateur.';
        }

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    if (this.userForm.dirty) {
      const confirmed = confirm('Voulez-vous vraiment quitter sans sauvegarder ? ');
      if (!confirmed) {
        return;
      }
    }

    this.router.navigate(['/admin/users']);
  }
}
