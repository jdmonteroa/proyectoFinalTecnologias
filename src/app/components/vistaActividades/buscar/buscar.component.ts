import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscar',
  imports: [FormsModule],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.css'
})
export class BuscarComponent {
  @Output() buscar = new EventEmitter<string>();
  textoBusqueda: string = '';

  emitirBusqueda() {
    const texto = this.textoBusqueda.trim().toLowerCase();
    this.buscar.emit(texto);
  }
} 
