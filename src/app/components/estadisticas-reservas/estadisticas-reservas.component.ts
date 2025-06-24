import { Component, OnInit } from '@angular/core';

import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartConfiguration } from 'chart.js';
import { ReservasService } from '../../../services/reservas.service';
import { Reserva } from '../../../services/reservas.service';

@Component({
  selector: 'app-estadisticas-reservas',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './estadisticas-reservas.component.html',
  styleUrls: ['./estadisticas-reservas.component.css']
})
export class EstadisticasReservasComponent implements OnInit {
  chartLabels: string[] = ['Tarjeta', 'Paypal', 'Efectivo'];
  chartData: number[] = [0, 0, 0];
  chartType: ChartType = 'pie';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#5e4b3c',
          font: {
            family: 'Segoe UI',
            size: 13
          }
        }
      },
      tooltip: {
        backgroundColor: '#d8cbb8',
        titleColor: '#3d2f23',
        bodyColor: '#3d2f23'
      }
    }
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

  get chartDisplayData() {
    return {
      labels: this.chartLabels,
      datasets: [
        {
          data: this.chartData,
          label: 'Métodos de Pago',
          backgroundColor: ['#d6c2a1', '#a0855b', '#e9dcc3'],
          borderColor: '#5e4b3c',
          borderWidth: 1
        }
      ]
    };
  }
}

