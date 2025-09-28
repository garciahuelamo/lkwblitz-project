import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '../../../services/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  userForm: FormGroup;
  currentUser: User | null = null;
  modalOpen = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email,
      });
    }
  }

  openSaveModal(): void {
    if (this.userForm.valid) {
      this.modalOpen = true;
    }
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  confirmSave(): void {
    if (!this.currentUser) return;

    const payload: { name?: string; email?: string } = {};

    if (this.userForm.value.name !== this.currentUser.name) {
      payload.name = this.userForm.value.name;
    }
    if (this.userForm.value.email !== this.currentUser.email) {
      payload.email = this.userForm.value.email;
    }

    if (Object.keys(payload).length === 0) {
      alert('No changes detected');
      this.closeModal();
      return;
    }

    this.authService.requestUserChange(payload).subscribe({
      next: (res) => {
        alert(res.message);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error sending change request:', err);
        alert('Error sending request');
        this.closeModal();
      }
    });
  }
}
