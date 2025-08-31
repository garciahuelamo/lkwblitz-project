import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit, OnDestroy {
  
  currentDate: Date = new Date();
  currentTime: string = '';
  private timer: any;

  userName = '';
  userAvatar = 'assets/avatar.png'; 
  userMenuOpen = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.userName = user.name || '';
        this.userAvatar = user.avatar ? `/assets/${user.avatar}` : 'assets/avatar.png';
      }

      // Iniciar reloj solo en cliente
      this.updateTime();
      this.timer = setInterval(() => this.updateTime(), 1000);
    }
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

  goTo(path: string) {
    this.router.navigate([`/user/${path}`]);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
