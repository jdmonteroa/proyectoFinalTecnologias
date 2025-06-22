import { Component, Input } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qr-visualizador',
  imports: [QRCodeComponent],
  templateUrl: './qr-visualizador.component.html',
  styleUrl: './qr-visualizador.component.css'
})
export class QrVisualizadorComponent {
   @Input() datos: any;
    valorQR: string = '';

  ngOnChanges(): void {
    if (this.datos) {
      this.valorQR = JSON.stringify(this.datos);
    }
  }
}
