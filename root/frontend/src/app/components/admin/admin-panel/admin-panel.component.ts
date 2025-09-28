// admin-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';

  constructor(private adminService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.errorMessage = '';

    if (typeof window === 'undefined' || !window.localStorage) {
      this.errorMessage = 'localStorage no disponible';
      this.loading = false;
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'No autenticado';
      this.loading = false;
      return;
    }

    this.adminService.getUsers(token).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }


  deleteUser(userId: number) {
    if (!confirm('¿Seguro que quieres borrar este usuario?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No autenticado');
      return;
    }

    this.adminService.deleteUser(userId, token).subscribe({
      next: () => {
        alert('Usuario borrado');
        this.loadUsers();
      },
      error: (err) => alert('Error al borrar usuario: ' + err.error.message),
    });
  }
}
