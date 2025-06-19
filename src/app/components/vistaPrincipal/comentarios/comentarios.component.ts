import { Component } from '@angular/core';
import { TestimoniosService } from '../testimonios.service';

@Component({
  selector: 'app-comentarios',
  imports: [],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
  reviews: any[];

  constructor(private testimoniosService: TestimoniosService) {
    this.reviews = this.testimoniosService.getTestimonios();
  }
}
