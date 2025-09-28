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
  editedUser: any = null;
  searchTerm: string = '';

  // --- Modal properties ---
  modalUser: any = null;
  modalAction: 'delete' | 'edit' | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error loading users';
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

  // --- Modal Methods ---
  openDeleteModal(user: any) {
    this.modalUser = user;
    this.modalAction = 'delete';
  }

  openEditModal(user: any) {
    this.modalUser = user;
    this.modalAction = 'edit';
    this.editedUser = { ...user }; 
  }

  closeModal() {
    this.modalUser = null;
    this.modalAction = null;
    this.editedUser = null;
  }

  confirmDeleteUser() {
    if (!this.modalUser) return;
    this.updatingUserId = this.modalUser.id;
    this.userService.deleteUser(this.modalUser.id).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
      },
      error: () => {
        this.updatingUserId = null;
        this.errorMessage = 'Failed to delete user'; 
      }
    });
  }

  saveUser() {
    if (!this.editedUser) return;
    this.updatingUserId = this.editedUser.id;
    this.userService.updateUser(this.editedUser).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
      },
      error: () => {
        this.updatingUserId = null;
        this.errorMessage = 'Failed to update user'; 
      }
    });
  }
}
