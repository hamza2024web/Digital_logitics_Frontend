// src/app/features/client/layout/client-layout. component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './client-layout.html',
  styleUrls: ['./client-layout.scss']
})
export class ClientLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  userName = '';
  currentDate = new Date();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

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
      this.userName = 'ADMIN';
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
