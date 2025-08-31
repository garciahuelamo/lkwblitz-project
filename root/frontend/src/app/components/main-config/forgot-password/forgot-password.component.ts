import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css', '../login/login.component.css']
})

export class ForgotPasswordComponent {
  email = '';
    message = '';

    constructor(private http: HttpClient) {}

    sendResetEmail() {
      this.message = '';
      this.http.post<{message: string}>('http://localhost:3000/forgot-password', { email: this.email }).subscribe({
        next: res => this.message = res.message || 'Email enviado.',
        error: err => this.message = err.error?.message || 'Error enviando email.'
      });
    }
}
