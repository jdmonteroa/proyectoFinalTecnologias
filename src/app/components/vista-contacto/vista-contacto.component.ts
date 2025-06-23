import { Component } from '@angular/core';
import { ContactoComponent } from '../vistaAcerca/contacto/contacto.component';
import { VideoComponent } from '../vistaAcerca/video/video.component';

@Component({
  selector: 'app-vista-contacto',
  imports: [ContactoComponent, VideoComponent],
  templateUrl: './vista-contacto.component.html',
  styleUrl: './vista-contacto.component.css'
})
export class VistaContactoComponent {

}
