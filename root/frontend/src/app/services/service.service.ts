import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());

  constructor(private http: HttpClient) {}

  // Observable para suscribirse en componentes
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  register(data: { name: string; email: string; password: string }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(err => throwError(() => err))
      );
  }

  // Login
  login(data: { email: string; password: string; rememberMe?: boolean }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(err => throwError(() => err))
      );
  }

  // Obtener usuario actual de forma síncrona
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Actualizar datos del usuario
  updateUser(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/update`, userData, { headers: this.getAuthHeaders() })
      .pipe(
        tap(user => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError(err => throwError(() => err))
      );
  }

  // Logout
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
    }
  }
}
