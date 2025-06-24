import { Component } from '@angular/core';

import { EstadisticasReservasComponent } from '../estadisticas-reservas/estadisticas-reservas.component';
import { EstadisticasHabitacionesComponent } from '../estadisticas-habitaciones/estadisticas-habitaciones.component';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [EstadisticasReservasComponent, EstadisticasHabitacionesComponent],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent {}
