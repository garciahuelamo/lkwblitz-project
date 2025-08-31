import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ShippingService } from '../../../services/shipping.service';
import { ShippoService } from '../../../services/shippo.service';
import { AuthService } from '../../../services/service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';

interface Address {
  name: string;
  street1: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
}

interface Parcel {
  weight: number;
  length: number;
  width: number;
  height: number;
  distance_unit: 'in' | 'cm';
  mass_unit: 'lb' | 'kg';
}

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit, OnDestroy {
  @ViewChild('orderForm') orderForm!: NgForm;

  userName = '';
  userMenuOpen = false;
  orderObjectId = '';
  rates: any[] = [];
  labelResult: any = null;
  loading = false;
  errorMsg = '';
  currentDate: Date = new Date();
  currentTime = '';
  private clockSubscription!: Subscription;

  order = {
    address_from: {} as Address,
    address_to: {} as Address,
    parcels: [] as Parcel[]
  };

  constructor(
    private shippingService: ShippingService,
    private shippoService: ShippoService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializar con un paquete por defecto
    this.order.parcels.push({
      weight: 2,
      length: 10,
      width: 5,
      height: 4,
      distance_unit: 'in',
      mass_unit: 'lb'
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) this.userName = currentUser.name;

    this.updateClock();
    this.clockSubscription = interval(1000).subscribe(() => this.updateClock());
  }

  ngOnDestroy(): void {
    this.clockSubscription?.unsubscribe();
  }

  // Carga un ejemplo de direcciones y paquete
  loadExample(): void {
    this.order.address_from = {
      name: 'Julien Dubois',
      street1: '12 Rue de Lyon',
      city: 'Lyon',
      zip: '69002',
      country: 'FR',  // Francia
      phone: '+33 4 12345678',
      email: 'julien@example.fr'
    };

    this.order.address_to = {
      name: 'Luca Rossi',
      street1: 'Via Roma 25',
      city: 'Milano',
      zip: '20121',
      country: 'IT',  // Italia
      phone: '+39 02 98765432',
      email: 'luca@example.it'
    };

    this.order.parcels = [
      {
        weight: 2.5,
        length: 40,
        width: 30,
        height: 15,
        distance_unit: 'cm',
        mass_unit: 'kg'
      }
    ];
  }



  // Obtener tarifas
  getRates(): void {
    if (!this.orderForm?.form.valid) {
      this.errorMsg = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.rates = [];

    this.validateAddress(this.order.address_from, 'origen')
      .then(() => this.validateAddress(this.order.address_to, 'destino'))
      .then(() => this.fetchRates())
      .catch(err => {
        this.errorMsg = err;
        this.loading = false;
      });
  }

  private validateAddress(address: Address, type: 'origen' | 'destino'): Promise<void> {
    return new Promise((resolve, reject) => {
      this.shippoService.validateAddress(address).subscribe({
        next: (res: any) => {
          if (!res?.validation_results?.is_valid) {
            reject(`Dirección de ${type} inválida. Revisa los datos.`);
          } else {
            resolve();
          }
        },
        error: (err) => {
          console.error(err);
          reject(`Error al validar dirección de ${type}.`);
        }
      });
    });
  }

  private fetchRates(): void {
    const parcelsConverted = this.order.parcels.map(p => this.convertParcelToInLb(p));
    const payload = {
      address_from: this.order.address_from,
      address_to: this.order.address_to,
      parcels: parcelsConverted
    };

    this.http.post<any>('http://localhost:3000/rates', payload).subscribe({
      next: res => {
        if (res?.rates?.length) {
          this.rates = res.rates;
          this.orderObjectId = res.order_object_id || '';

          // Guardamos en localStorage para RatesComponent
          localStorage.setItem('rates', JSON.stringify(this.rates));
          localStorage.setItem('orderObjectId', this.orderObjectId);

          // Redirigir a RatesComponent
          this.router.navigate(['/user/rates']);
        } else {
          this.errorMsg = 'No se encontraron tarifas para estos datos.';
        }
        this.loading = false;
      },
      error: err => {
        console.error('Error al obtener tarifas:', err);
        this.errorMsg = err.error?.message || 'Error al obtener tarifas';
        this.loading = false;
      }
    });
  }

  private convertParcelToInLb(parcel: Parcel): Parcel {
    const weight = parcel.mass_unit === 'kg' ? +(parcel.weight * 2.20462).toFixed(2) : parcel.weight;
    const length = parcel.distance_unit === 'cm' ? +(parcel.length * 0.393701).toFixed(2) : parcel.length;
    const width = parcel.distance_unit === 'cm' ? +(parcel.width * 0.393701).toFixed(2) : parcel.width;
    const height = parcel.distance_unit === 'cm' ? +(parcel.height * 0.393701).toFixed(2) : parcel.height;
    return { ...parcel, weight, length, width, height, mass_unit: 'lb', distance_unit: 'in' };
  }

  // Funciones auxiliares
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  updateClock(): void {
    const now = new Date();
    this.currentDate = now;
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    this.currentTime = `${h}:${m}:${s}`;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  addParcel(): void {
    this.order.parcels.push({ weight: 0, length: 0, width: 0, height: 0, distance_unit: 'in', mass_unit: 'lb' });
  }

  removeParcel(index: number): void {
    if (this.order.parcels.length > 1) this.order.parcels.splice(index, 1);
  }
}
