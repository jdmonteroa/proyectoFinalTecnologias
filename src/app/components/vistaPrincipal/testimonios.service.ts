import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestimoniosService {
  private testimonios = [
    {
      nombre: 'Laura M.',
      descripcion: 'Una experiencia mágica. Despertar con el sonido del bosque fue simplemente inolvidable.'
    },
    {
      nombre: 'Carlos R.',
      descripcion: 'Cada detalle está pensado para conectar con la naturaleza. Volveré sin duda alguna.'
    },
    {
      nombre: 'Elena G.',
      descripcion: 'El ambiente rústico con toques modernos crea una paz única. Me sentí renovada.'
    }
  ];

  getTestimonios() {
    return this.testimonios;
  }
  
  constructor() { }
}
