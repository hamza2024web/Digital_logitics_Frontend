import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <h1 class="error-code">403</h1>
        <h2>Accès Refusé</h2>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <button (click)="goBack()" class="btn-primary">
          Retour
        </button>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .error-content {
      background: white;
      border-radius: 16px;
      padding: 60px 40px;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .error-code {
      font-size: 120px;
      font-weight:  800;
      color: #f56565;
      margin:  0;
      line-height: 1;
    }

    h2 {
      font-size: 32px;
      color: #1a202c;
      margin:  20px 0 10px;
    }

    p {
      color: #718096;
      font-size: 16px;
      margin-bottom: 30px;
    }

    .btn-primary {
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow:  0 10px 20px rgba(102, 126, 234, 0.3);
      }
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']);
  }
}
