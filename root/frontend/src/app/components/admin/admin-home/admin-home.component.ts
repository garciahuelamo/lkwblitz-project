import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/service.service'; 

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  
  currentDate: Date = new Date();
  currentTime: string = '';
  private timer: any;
  userName = '';
  userAvatar = 'assets/default.png'; 

  userMenuOpen = false;  

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name || '';
      this.userAvatar = user.avatar 
        ? (/^https?:\/\//.test(user.avatar) ? user.avatar : `assets/${user.avatar}`)
        : 'assets/default.png';
    }

    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  goTo(path: string) {
    if (typeof path === 'string' && path.trim()) {
      this.router.navigate([path], { relativeTo: this.activatedRoute });
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

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
