import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaz para tipado fuerte
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error('Error al obtener usuarios:', err);
          return throwError(() => err);
        })
      );
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-user/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error(`Error al eliminar usuario ${userId}:`, err);
          return throwError(() => err);
        })
      );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update-user/${user.id}`, user, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error(`Error al actualizar usuario ${user.id}:`, err);
          return throwError(() => err);
        })
      );
  }
}
