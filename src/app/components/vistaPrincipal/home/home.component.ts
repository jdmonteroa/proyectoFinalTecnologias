import { Component } from '@angular/core';
import { CarruselComponent } from '../carrusel/carrusel.component';
import { CardsHomeComponent } from '../cards-home/cards-home.component';
import { ImagenComponent } from '../imagen/imagen.component';
import { ComentariosComponent } from '../comentarios/comentarios.component';

@Component({
  selector: 'app-home',
  imports: [CarruselComponent, CardsHomeComponent, ImagenComponent, ComentariosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
