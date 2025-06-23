import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartConfiguration } from 'chart.js';
import { ReservasService } from '../../../services/reservas.service';
import { Reserva } from '../../../services/reservas.service';

@Component({
  selector: 'app-estadisticas-reservas',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './estadisticas-reservas.component.html',
  styleUrls: ['./estadisticas-reservas.component.css']
})
export class EstadisticasReservasComponent implements OnInit {
  chartLabels: string[] = ['Tarjeta', 'Paypal', 'Efectivo'];
  chartData: number[] = [0, 0, 0];
  chartType: ChartType = 'pie';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.reservasService.getReservas().subscribe((reservas: Reserva[]) => {
      const conteo: { [key in 'Tarjeta' | 'Paypal' | 'Efectivo']: number } = {
        Tarjeta: 0,
        Paypal: 0,
        Efectivo: 0
      };

      reservas.forEach((r: Reserva) => {
        const metodo = r.metodopago.charAt(0).toUpperCase() + r.metodopago.slice(1).toLowerCase() as 'Tarjeta' | 'Paypal' | 'Efectivo';
        if (conteo.hasOwnProperty(metodo)) {
          conteo[metodo]++;
        }
      });

      this.chartData = [conteo.Tarjeta, conteo.Paypal, conteo.Efectivo];
    });
  }
}
