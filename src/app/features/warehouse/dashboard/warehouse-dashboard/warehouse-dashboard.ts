import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-warehouse-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './warehouse-dashboard.html',
  styleUrl: './warehouse-dashboard.scss'
})
export class WarehouseDashboardComponent implements OnInit {
  private authService = inject(AuthService);

  userEmail = '';
  userRole = '';
  userName = 'Manager';
  currentDate = new Date();
  sidebarCollapsed = false;

  // Stats - will be populated from API
  stats = {
    totalItems: 0,
    inboundToday: 0,
    outboundToday: 0,
    lowStockAlerts: 0,
    capacityUsed: 0
  };

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.userRole = this.authService.getUserRole();
    this.userName = this.userEmail.split('@')[0] || 'Manager';
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
