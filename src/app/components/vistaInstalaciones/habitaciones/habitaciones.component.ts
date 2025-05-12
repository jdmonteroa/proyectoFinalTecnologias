import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-habitaciones',
  imports: [MatCardModule, MatButtonModule,RouterModule],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent {
  habitaciones = [
    {
      nombre: 'Celestial Suite',
      descripcion: 'Una opción accesible y acogedora, ideal para un día de descanso. Esta suite cuenta con una cómoda cama king size, sofá-cama, baño privado, una pequeña sala de estar y cocineta equipada. Además, ofrece acceso libre a las áreas comunes del complejo. Perfecta para quienes buscan tranquilidad y funcionalidad en un entorno cómodo.',
      imagen: 'img/cardinstalaciones1.jpg'
    },
    {
      nombre: 'Mystic Forest Suite',
      descripcion: 'Sumérgete en una experiencia rodeada de naturaleza. Esta suite intermedia ofrece camas king size, sofá-cama, cocina completa, terraza privada con vista al bosque y acceso exclusivo a un relajante spa. Es ideal para familias o parejas que desean comodidad, privacidad y conexión con el entorno natural.',
      imagen: 'img/cardinstalaciones2.jpg'
    },
    {
      nombre: 'Golden Horizon Suite',
      descripcion: 'La experiencia más lujosa de nuestro complejo. Esta suite premium cuenta con una vista panorámica inigualable, espacios amplios y elegantes, cama king size, baño privado con jacuzzi, cocina equipada con minibar, chimenea, terraza exclusiva y desayuno gourmet incluido. Además, disfrutarás de atención personalizada y servicio privado disponible las 24 horas. Ideal para una escapada inolvidable.',
      imagen: 'img/cardinstalaciones3.jpg'
    }
  ];
  
}
