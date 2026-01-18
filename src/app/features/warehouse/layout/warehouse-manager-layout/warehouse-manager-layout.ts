import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-warehouse-manager-layout',
  imports: [
    RouterOutlet
  ],
  templateUrl: './warehouse-manager-layout.html',
  styleUrl: './warehouse-manager-layout.scss',
})
export class WarehouseManagerLayout implements OnInit {
  sidebarCollapsed = false;
  userName =  '';
  currentDate = new Date();

  stats = {
    lowStockAlerts: 0,
    totalItems: 0,
    inboundToday: 0,
    outboundToday:  0,
    capacityUsed: 0
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  private loadUserInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`
        : user.email.split('@')[0];
    } else {
      this.userName = 'WAREHOUSE_MANAGER';
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }
}
