import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/service.service'; // Ajusta la ruta
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isRegisterMode = false;  // Modo login/registro
  loading = false;
  errorMessage: string = '';
  showRegisterPopup: boolean = false; // controla el popup de registro

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  // --- LOGIN ---
  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password, remember } = this.loginForm.getRawValue();

    this.authService.login({ email, password, rememberMe: remember }).subscribe({
      next: (res) => {
        this.loading = false;
        localStorage.setItem('token', res.token);
        localStorage.setItem('userRole', res.user.role);

        if (res.user.role === 'admin') {
          this.router.navigate(['/admin/home']);
        } else {
          this.router.navigate(['/user/home']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al iniciar sesión';
      },
    });
  }

  // --- REGISTRO ---
  onRegisterSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;

    const { name, email, password } = this.registerForm.getRawValue();

    this.authService.register({ name, email, password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.showRegisterPopup = true; // mostrar popup en lugar de alert
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al registrar usuario';
      },
    });
  }

  closeRegisterPopup() {
    this.showRegisterPopup = false;
    this.toggleMode(); // volver al modo login
  }
}
