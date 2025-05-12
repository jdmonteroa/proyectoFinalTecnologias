import { Component } from '@angular/core';
import { DesarrolladoresComponent } from "../desarrolladores/desarrolladores.component";
import { FooterComponentDes } from '../footer-des/footer.component';

@Component({
  selector: 'app-contenedor',
  imports: [DesarrolladoresComponent,FooterComponentDes],
  templateUrl: './contenedor.component.html',
  styleUrl: './contenedor.component.css'
})
export class ContenedorComponent {

}
