import { Component } from '@angular/core';
import { AuthService } from '../../../services/service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  showPopup: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res.user);
        localStorage.setItem('token', res.token);

        // Mostrar popup manualmente
        this.showPopup = true;  
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Error en el registro';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  closePopup() {
    this.showPopup = false;
    this.router.navigate(['/dashboard']); // Navega después de cerrar el popup
  }
}
