import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasReservasComponent } from '../estadisticas-reservas/estadisticas-reservas.component';
import { EstadisticasHabitacionesComponent } from '../estadisticas-habitaciones/estadisticas-habitaciones.component';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, EstadisticasReservasComponent, EstadisticasHabitacionesComponent],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent {}
