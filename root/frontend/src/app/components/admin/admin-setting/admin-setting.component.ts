import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-setting',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.component.css']
})
export class AdminSettingComponent implements OnInit {
  userForm: FormGroup;
  currentUser: User | null = null;
  modalOpen = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: [''],
      email: [''],
      role: ['']
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.userForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email,
        role: this.currentUser.role
      });
    }
  }

  openSaveModal() {
    if (this.userForm.valid) {
      this.modalOpen = true;
    }
  }

  closeModal() {
    this.modalOpen = false;
  }

  confirmSave() {
    if (!this.currentUser) return;

    const updatedUser = {
      id: this.currentUser.id,
      ...this.userForm.value
    };

    this.authService.updateUser(updatedUser).subscribe({
      next: (res) => {
        this.modalOpen = false;
        console.log('User updated:', res.user);
      },
      error: (err) => {
        this.modalOpen = false;
        console.error('Error updating user:', err);
      }
    });
  }
}
