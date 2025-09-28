import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: number;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor() { }

  ngOnInit(): void {
    // Datos mock
    this.orders = [
      { id: 'ORD-1001', date: '2025-09-15', status: 'Delivered', total: 120.50, items: 3 },
      { id: 'ORD-1002', date: '2025-09-20', status: 'Shipped', total: 75.20, items: 1 },
      { id: 'ORD-1003', date: '2025-09-22', status: 'Pending', total: 210.99, items: 5 },
      { id: 'ORD-1004', date: '2025-09-25', status: 'Cancelled', total: 45.00, items: 1 },
    ];
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'Pending': return '#facc15'; // amarillo
      case 'Shipped': return '#3b82f6'; // azul
      case 'Delivered': return '#16a34a'; // verde
      case 'Cancelled': return '#ef4444'; // rojo
      default: return '#6b7280'; // gris
    }
  }
}
