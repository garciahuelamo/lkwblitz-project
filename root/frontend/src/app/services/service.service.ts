import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  login(data: { email: string; password: string; rememberMe?: boolean }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }),
        catchError(err => throwError(() => err))
      );
  }

  register(data: { name: string; email: string; password: string }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/register`, data)
      .pipe(catchError(err => throwError(() => err)));
  }

  changeUserRole(userId: number, role: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/admin/change-role`,
      { userId, newRole: role },
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(err => throwError(() => err)));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`, { headers: this.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/delete-user/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  updateUser(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/update`, userData, { headers: this.getAuthHeaders() })
      .pipe(
        tap(user => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
          }
        }),
        catchError(err => throwError(() => err))
      );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
}
