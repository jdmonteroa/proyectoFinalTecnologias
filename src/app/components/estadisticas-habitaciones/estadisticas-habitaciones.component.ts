import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartConfiguration } from 'chart.js';
import { ReservasService, Reserva } from '../../../services/reservas.service';

@Component({
  selector: 'app-estadisticas-habitaciones',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './estadisticas-habitaciones.component.html',
  styleUrls: ['./estadisticas-habitaciones.component.css']
})
export class EstadisticasHabitacionesComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  chartLabels: string[] = [];
  chartData: number[] = [];
  chartType: ChartType = 'bar';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true
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
