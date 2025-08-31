import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/service.service'; // ruta según tu proyecto
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {
  constructor(private router: Router) {}

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isRegisterMode = false;  // <-- controla si estamos en modo registro o login

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

  loading = false;
  errorMessage: any;

    toggleMode() {
      this.isRegisterMode = !this.isRegisterMode;
    }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password, remember } = this.loginForm.getRawValue();

    this.authService.login({
      email,
      password,
      rememberMe: remember // mapeo al nombre que espera el backend
    }).subscribe({
      next: (res) => {
        this.loading = false;

            // Guardar token y el rol de usuario
        localStorage.setItem('token', res.token);
        localStorage.setItem('userRole', res.user.role);
        
            // Redirigimos según el rol
        if (res.user.role === 'admin') {
          this.router.navigate(['/admin/home']);
        } else {
          this.router.navigate(['/user/home']); // CORRECTO
        }

        console.log(res)
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Error logging in');
      }
    });
}


onRegisterSubmit() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  this.loading = true;

  const { name, email, password } = this.registerForm.getRawValue();

  this.authService.register({ name, email, password })
    .subscribe({
      next: (res) => {
        this.loading = false;
        alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
        this.toggleMode();
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Error al registrar usuario');
      }
    });
  }
}


