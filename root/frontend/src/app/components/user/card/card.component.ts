import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'] 
})
export class CardComponent {
  constructor(private router: Router) {}

  goTo(path: string) {
    this.router.navigate([`/user/${path}`]);
  }
}
