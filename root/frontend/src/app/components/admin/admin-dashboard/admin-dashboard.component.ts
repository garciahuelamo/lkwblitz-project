import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit {
  @ViewChild('lineChart') lineChart?: BaseChartDirective;
  @ViewChild('barChart') barChart?: BaseChartDirective;

  public lineChartType: ChartType = 'line';
  public lineChartLabels: string[] = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  public lineChartData: ChartConfiguration['data'] = {
    labels: this.lineChartLabels,
    datasets: [
      { data: [5, 8, 6, 10], label: 'New Clients', borderColor: '#4ade80', fill: false }
    ]
  };

  public barChartType: ChartType = 'bar';
  public barChartLabels: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public barChartData: ChartConfiguration['data'] = {
    labels: this.barChartLabels,
    datasets: [
      { data: [12, 19, 8, 15, 22, 10, 7], label: 'Daily Orders', backgroundColor: '#3b82f6' }
    ]
  };

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.lineChart?.update();
      this.barChart?.update();
    }, 0);

    window.addEventListener('resize', () => {
      this.lineChart?.update();
      this.barChart?.update();
    });
  }
}
