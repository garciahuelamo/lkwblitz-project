import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Strongly typed User interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string; // optional
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  // Helper: get headers with Bearer token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error('Failed to fetch users:', err);
          return throwError(() => err);
        })
      );
  }

  // Delete a user by ID
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-user/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error(`Failed to delete user ${userId}:`, err);
          return throwError(() => err);
        })
      );
  }

  // Update a user
  updateUser(user: Partial<User> & { id: number }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update-user/${user.id}`, user, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error(`Failed to update user ${user.id}:`, err);
          return throwError(() => err);
        })
      );
  }

  // Optional: change user role
  changeUserRole(userId: number, role: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/change-role`,
      { userId, newRole: role },
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error(`Failed to change role for user ${userId}:`, err);
        return throwError(() => err);
      })
    );
  }
}
