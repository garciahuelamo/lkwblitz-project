import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css', '../admin-home/admin-home.component.css']
})

export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading = false;
  errorMessage = '';
  updatingUserId: number | null = null;
  editingUserId: number | null = null;
  editedUser: any = null;

  searchTerm: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data; // Copia completa para filtrar
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  deletingUserId: number | null = null;

  deleteUser(id: number) {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
      this.deletingUserId = id;
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.deletingUserId = null;
          this.loadUsers();
        },
        error: () => {
          this.deletingUserId = null;
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  updateUser(user: any) {
    if (confirm(`¿Quieres actualizar el usuario ${user.name}?`)) {
      this.updatingUserId = user.id;
      this.userService.updateUser(user).subscribe({
        next: () => {
          this.updatingUserId = null;
          this.loadUsers(); // Recargar la lista
        },
        error: () => {
          this.updatingUserId = null;
          alert('Error al actualizar el usuario');
        }
      });
    }
  }

  startEditing(user: any) {
    this.editingUserId = user.id;
    // Clona el usuario para no modificar directamente la lista mientras editas
    this.editedUser = { ...user };
  }

  cancelEditing() {
    this.editingUserId = null;
    this.editedUser = null;
  }

  saveUser() {
    if (!this.editedUser) return;

    this.updatingUserId = this.editedUser.id;
    this.userService.updateUser(this.editedUser).subscribe({
      next: () => {
        this.updatingUserId = null;
        this.editingUserId = null;
        this.editedUser = null;
        this.loadUsers(); // refresca la lista para mostrar cambios
      },
      error: () => {
        this.updatingUserId = null;
        alert('Error al actualizar el usuario');
      }
    });
  }

}
