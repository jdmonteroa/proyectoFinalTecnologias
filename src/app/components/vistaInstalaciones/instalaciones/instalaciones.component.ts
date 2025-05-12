import { Component } from '@angular/core';
import { MasonryComponent } from '../masonry/masonry.component';
import { HabitacionesComponent } from '../habitaciones/habitaciones.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-instalaciones',
  imports: [MasonryComponent,HabitacionesComponent,RouterOutlet],
  templateUrl: './instalaciones.component.html',
  styleUrl: './instalaciones.component.css'
})
export class InstalacionesComponent {
}