import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShippingService } from '../../../services/shipping.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/service.service';

@Component({
  selector: 'app-rates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css', '../user-header/user-header.component.css', '../user-home/user-home.component.css']
})
export class RatesComponent implements OnInit {

  currentDate: Date = new Date();
  currentTime: string = '';
  private timer: any;

  userName = '';
  userAvatar = 'assets/avatar.png'; 
  userMenuOpen = false;

  rates: any[] = [];
  orderObjectId: string = '';
  loading: boolean = false;
  errorMsg: string = '';
  labelResult: any = null;

  constructor(private router: Router, private shippingService: ShippingService, private authService: AuthService) {}

  ngOnInit(): void {
    // Cargar rates y orderObjectId desde localStorage
    const storedRates = localStorage.getItem('rates');
    this.rates = storedRates ? JSON.parse(storedRates) : [];

    const storedOrderId = localStorage.getItem('orderObjectId');
    this.orderObjectId = storedOrderId || '';

    console.log('Rates cargadas:', this.rates);

    if (this.rates.length === 0) {
      this.errorMsg = 'No hay tarifas disponibles.';
    }
  }

  buyLabel(rateObjectId: string): void {
    if (!this.orderObjectId) {
      this.errorMsg = 'No se encontró Order Object ID';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.labelResult = null;

    this.shippingService.buyLabel(this.orderObjectId, rateObjectId).subscribe({
      next: res => {
        this.labelResult = res;
        this.loading = false;
        alert('Etiqueta comprada correctamente!');
      },
      error: err => {
        console.error(err);
        this.errorMsg = 'Error al comprar etiqueta';
        this.loading = false;
      }
    });
  }

  getCarrierLogo(providerName: string): string {
    // Si no hay nombre, retorna logo genérico
    if (!providerName) return 'assets/default.png';

    // Normalizar el nombre: todo minúsculas, espacios por guiones
    const normalizedName = providerName.toLowerCase().replace(/\s+/g, '-');

    // Ruta del logo
    const logoPath = `assets/${normalizedName}.png`;

    // Opcional: intentar cargarlo con una imagen invisible para verificar existencia
    const img = new Image();
    img.src = logoPath;
    img.onerror = () => {
      img.src = 'assets/default.png'; // fallback si no existe
    };

    return logoPath;
  }


  updateTime() {
    const now = new Date();
    this.currentDate = now;
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
