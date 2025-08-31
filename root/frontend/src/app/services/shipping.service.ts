import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RateRequest {
  address_from: any;
  address_to: any;
  parcels: any[];
}

export interface LabelResponse {
  tracking_number: string;
  label_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private apiUrl = 'http://localhost:3000'; // tu backend

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

  getRates(orderData: RateRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rates`, orderData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Error al obtener tarifas:', err);
        return throwError(() => err);
      })
    );
  }

  // ✅ método limpio: SOLO hace la llamada al backend
  buyLabel(orderObjectId: string, rateObjectId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/buy-label`, {
      orderObjectId,
      rateObjectId
    }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Error al comprar etiqueta:', err);
        return throwError(() => err);
      })
    );
  }
}
