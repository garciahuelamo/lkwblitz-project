import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface AddressValidationResult {
  validation_results: {
    is_valid: boolean;
    messages?: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class ShippoService {
  private apiUrl = 'http://localhost:3000'; // tu backend

  constructor(private http: HttpClient) {}

  /**
   * Valida una dirección usando tu backend o Shippo
   */
  validateAddress(address: any): Observable<AddressValidationResult> {
    // Si tienes un endpoint real:
    // return this.http.post<AddressValidationResult>(`${this.apiUrl}/validate-address`, address);

    // Simulación para desarrollo: siempre devuelve válida
    return of({ validation_results: { is_valid: true } });
  }

  /**
   * Opcional: podrías agregar aquí métodos para crear envíos, obtener tarifas, etc.
   */
}
