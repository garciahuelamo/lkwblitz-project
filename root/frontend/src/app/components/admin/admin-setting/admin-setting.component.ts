import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/service.service'; // Ajusta ruta
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-setting',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-setting.component.html',
  styleUrl: './admin-setting.component.css'
})
export class AdminSettingComponent {

  userForm: FormGroup;
  currentUser: User | null = null;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: [''],
      email: [''],
      // otros campos que quieras permitir editar
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.userForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email,
        // otros campos si los tienes
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value;
      // Aquí deberías llamar un método en el AuthService para actualizar datos del usuario
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
