import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../../services/service.service';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../main-config/back-button/back-button.component';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit, OnDestroy {
  userName = '';
  userMenuOpen = false;
  currentDate: Date = new Date();
  currentTime: string = '';
  private clockSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Cargar nombre de usuario desde AuthService
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) this.userName = currentUser.name;

    // Solo ejecutar reloj en navegador (no SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.updateClock();
      this.clockSubscription = interval(1000).subscribe(() => this.updateClock());
    }
  }

  ngOnDestroy(): void {
    this.clockSubscription?.unsubscribe();
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.authService.logout();  
    this.userName = '';          
    this.userMenuOpen = false;   
    this.router.navigate(['/login']);
  }

  private updateClock(): void {
    const now = new Date();
    this.currentDate = now;

    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    this.currentTime = `${h}:${m}:${s}`;
  }
}
