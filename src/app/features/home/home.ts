import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls:  ['./home.scss']
})
export class HomeComponent {
  activeRole: 'admin' | 'warehouse' | 'client' = 'admin';
  mobileMenuOpen = false;

  constructor(private router: Router) {}

  setActiveRole(role:  'admin' | 'warehouse' | 'client'): void {
    this.activeRole = role;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router. navigate(['/register']);
  }
}
