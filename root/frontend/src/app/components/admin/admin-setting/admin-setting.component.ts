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
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.userForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email,
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value;
     
      this.authService.updateUser(updatedUser).subscribe({
        next: (res) => {
          alert('Datos actualizados correctamente');
        },
        error: (err) => {
          alert('Error al actualizar usuario');
        }
      });
    }
  }
  
}
