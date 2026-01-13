import {Component, OnInit} from '@angular/core';
import {User} from '../../../../api/models/user.model';
import {UserApiService} from '../../../../api/services/user-api.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone : true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  filterRole: string = '';
  filterStatus: string = '';

  constructor(private userApiService: UserApiService){
  }

    ngOnInit(): void {
        this.loadUsers();
    }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userApiService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  onFilterRole(event: Event): void {
    const select = event.target as HTMLInputElement;
    this.filterRole = select.value;
    this.applyFilters();
  }

  onFilterStatus(event: Event): void {
    const select = event.target as HTMLInputElement;
    this.filterStatus = select.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm ||
        user.firstName.toLowerCase().includes(this.searchTerm) ||
        user.lastName.toLowerCase().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm);

      const matchesRole = !this.filterRole || user.role === this.filterRole;

      const matchesStatus = !this.filterStatus ||
        (this.filterStatus === 'active' && user.active) ||
        (this.filterStatus === 'inactive' && !user.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterRole = '';
    this.filterStatus = '';
    this.filteredUsers = this.users;
  }

  toggleUserStatus(user : User): void {
    const action = user.active ? 'désactiver' : 'activer';

    if (!confirm(`Voulez-vous vraiment ${action} l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      return;
    }

    this.userApiService.updateUserStatus(user.id, !user.active).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.applyFilters();
        alert(`Utilisateur ${action} avec succès`);
      },
      error: (error) => {
        alert(`Erreur lors de la modification: ${error.message}`);
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Voulez-vous vraiment supprimer l'utilisateur ${user.firstName} ${user.lastName} ?\nCette action est irréversible.`)) {
      return;
    }

    this.userApiService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.applyFilters();
        alert('Utilisateur supprimé avec succès');
      },
      error: (error) => {
        alert(`Erreur lors de la suppression: ${error.message}`);
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'badge-admin';
      case 'WAREHOUSE_MANAGER': return 'badge-warehouse';
      case 'CLIENT': return 'badge-client';
      default: return 'badge-default';
    }
  }

  getRoleLabel(role: string): string{
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'WAREHOUSE_MANAGER': return 'Gestionnaire';
      case 'CLIENT': return 'Client';
      default: return role;
    }
  }

  getStatusLabel(active:boolean): string {
    return active ? 'Actif' : 'Inactif';
  }
}
