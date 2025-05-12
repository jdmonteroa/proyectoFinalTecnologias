import { Component } from '@angular/core';
import { FormReactivoComponent } from '../form-reactivo/form-reactivo.component';
import { CollageComponent } from '../collage/collage.component';

@Component({
  selector: 'app-reservaciones',
  imports: [FormReactivoComponent, CollageComponent],
  templateUrl: './reservaciones.component.html',
  styleUrl: './reservaciones.component.css'
})
export class ReservacionesComponent {

}
