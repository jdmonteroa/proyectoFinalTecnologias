import { Component, OnInit, ViewChild } from '@angular/core';

import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartConfiguration } from 'chart.js';
import { ReservasService, Reserva } from '../../../services/reservas.service';

@Component({
  selector: 'app-estadisticas-habitaciones',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './estadisticas-habitaciones.component.html',
  styleUrls: ['./estadisticas-habitaciones.component.css']
})
export class EstadisticasHabitacionesComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  chartLabels: string[] = [];
  chartData: number[] = [];
  chartType: ChartType = 'bar';

  chartOptions: ChartConfiguration['options'] = {
  responsive: true,
  plugins: {
    legend: {
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
  },
  scales: {
    x: {
      ticks: {
        color: '#5e4b3c',
        font: {
          size: 12,
          family: 'Segoe UI'
        }
      },
      grid: {
        color: '#ece3d9'
      }
    },
    y: {
      ticks: {
        color: '#5e4b3c',
        font: {
          size: 12,
          family: 'Segoe UI'
        }
      },
      grid: {
        color: '#ece3d9'
      }
    }
  }
};


  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.reservasService.getReservas().subscribe({
      next: (reservas: Reserva[]) => {
        const conteo: { [habitacion: string]: number } = {};

        reservas.forEach(r => {
          const tipo = r.tipohabitacion?.trim().toLowerCase();
          if (tipo) {
            const nombreCapitalizado = tipo
              .split(' ')
              .map(p => p.charAt(0).toUpperCase() + p.slice(1))
              .join(' ');
            conteo[nombreCapitalizado] = (conteo[nombreCapitalizado] || 0) + 1;
          }
        });

        this.chartLabels = Object.keys(conteo);
        this.chartData = Object.values(conteo);

        // 💥 Fuerza el redibujado
        setTimeout(() => {
          this.chart?.update();
        }, 0);
      },
      error: err => {
        console.error('Error al cargar reservas:', err);
      }
    });
  }

  
}
