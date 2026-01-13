import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  sidebarCollapsed = false;
  userName = '';
  currentDate = new Date();

  stats = {
    totalUsers : 0,
    totalProducts:0,
    activeWarehouses:0,
    lowStockAlerts: 0
  };

  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();

    if (user) {
      this.userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`
        : user.email.split('@')[0];
    } else {
      this.userName = 'ADMIN';
    }

    this.loadStats();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  loadStats(): void {
    this.stats = {
      totalUsers: 156,
      totalProducts: 89,
      activeWarehouses:  4,
      lowStockAlerts: 3
    }
  }

  formatNumber(num: number): string{
    return num.toLocaleString('fr-FR');
  }
}
