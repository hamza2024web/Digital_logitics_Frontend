import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../../core/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone : true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm! : FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(private fb : FormBuilder, private authService : AuthService, private router : Router, private route : ActivatedRoute)
  {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email : ['',[Validators.required, Validators.email]],
      password : ['',[Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get email(){
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() : void {
    this.errorMessage = '';

    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login réussi : ', response);

        if(this.returnUrl && this.returnUrl !== '/'){
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (error) => {
        console.error('Erreur Login : ', error);
        this.errorMessage = error.message || 'Erreur lors de la connexion';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  fillTestCredentials(role : 'admin' | 'warehouse' | 'client'): void {
    switch (role) {
      case 'admin':
        this.loginForm.patchValue({
          email: 'admin@logistics.com',
          password: 'admin123'
        });
        break;
      case 'warehouse':
        this.loginForm.patchValue({
          email: 'warehouse@logistics.com',
          password: 'warehouse123'
        });
        break;
      case 'client':
        this.loginForm.patchValue({
          email: 'client@logistics.com',
          password: 'client123'
        });
        break;
    }
  }
}
