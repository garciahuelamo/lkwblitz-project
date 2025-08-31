import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CommonModule], // <- necesario para *ngIf, *ngFor, etc.
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent {
  @Input() userName = '';
  @Input() userAvatar = '';
  @Input() userMenuOpen = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  toggleUserMenu() {
    this.toggleMenu.emit();
  }

  logout() {
    this.logoutClick.emit();
  }
}
