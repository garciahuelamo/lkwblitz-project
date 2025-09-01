import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/service.service'; // Ajusta ruta
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-setting',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-settings.component.css',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent implements OnInit {

  userForm: FormGroup;
  currentUser: User | null = null;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: [''],
      email: [''],
      role: [{ value: '', disabled: true }] // rol solo lectura para usuarios normales
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

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.getRawValue(); // incluye campos deshabilitados
      this.authService.updateUser(updatedUser).subscribe({
        next: (res) => {
          alert('Datos actualizados correctamente');
          // actualizar el localStorage si es necesario
        },
        error: (err) => {
          alert('Error al actualizar usuario');
        }
      });
    }
  }
}
