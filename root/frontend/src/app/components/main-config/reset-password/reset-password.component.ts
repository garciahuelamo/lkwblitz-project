import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css', '../login/login.component.css']
})

export class ResetPasswordComponent {
  password = '';
    message = '';
    token = '';

    constructor(private route: ActivatedRoute, private http: HttpClient) {
      this.token = this.route.snapshot.paramMap.get('token') || '';
    }

    resetPassword() {
      this.message = '';
      this.http.post<{message: string}>('http://localhost:3000/reset-password', { token: this.token, newPassword: this.password }).subscribe({
        next: res => this.message = res.message || 'Contraseña actualizada.',
        error: err => this.message = err.error?.message || 'Error actualizando contraseña.'
      });
    }
}
