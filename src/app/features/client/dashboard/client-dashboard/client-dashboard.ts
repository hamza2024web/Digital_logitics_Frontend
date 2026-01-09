import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="header">
        <h1>🎯 Dashboard CLIENT</h1>
        <button (click)="logout()" class="btn-logout">Déconnexion</button>
      </div>
      <div class="content">
        <div class="welcome-card">
          <h2>Bienvenue, {{ userEmail }}</h2>
          <p>Rôle: <strong>{{ userRole }}</strong></p>
          <p class="success">✅ Authentification réussie !</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f7fafc;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 20px 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }

    h1 {
      margin: 0;
      color:  #1a202c;
      font-size: 24px;
    }

    .btn-logout {
      padding: 10px 20px;
      background: #f56565;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition:  all 0.3s;

      &:hover {
        background: #e53e3e;
      }
    }

    .content {
      max-width: 800px;
      margin: 0 auto;
    }

    .welcome-card {
      background: white;
      padding: 40px;
      border-radius:  12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }

    h2 {
      color: #2d3748;
      margin-bottom: 10px;
    }

    p {
      color: #718096;
      font-size: 16px;
    }

    strong {
      color: #f56565;
      font-size: 18px;
    }

    .success {
      color: #48bb78;
      font-weight: 600;
      font-size: 18px;
      margin-top: 20px;
    }
  `]
})
export class AdminDashboardComponent {
  userEmail = '';
  userRole = '';

  constructor(private authService: AuthService) {
    this.userEmail = this.authService.getUserEmail();
    this.userRole = this.authService.getUserRole();
  }

  logout(): void {
    this.authService.logout();
  }
}
