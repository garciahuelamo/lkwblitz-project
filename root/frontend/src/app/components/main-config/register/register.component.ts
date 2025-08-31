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
        this.router.navigate(['/dashboard']);
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

}
