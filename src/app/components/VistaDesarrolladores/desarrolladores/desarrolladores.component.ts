import { Component } from '@angular/core';
import { ADMIS } from '../../inicio-sesion/misadmis';

@Component({
  selector: 'app-desarrolladores',
  imports: [],
  templateUrl: './desarrolladores.component.html',
  styleUrl: './desarrolladores.component.css'
})
export class DesarrolladoresComponent {
  ADMIS = ADMIS;
}
