import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { BuscarComponent } from '../buscar/buscar.component';
import { ActividadesService } from '../actividades.service';
import { Actividades } from '../actividades';
import { HttpClientModule } from '@angular/common/http';
import { ImagenComponent } from '../../vistaPrincipal/imagen/imagen.component';
import { LoadingService } from '../../../services/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-actividades',
  imports: [CardComponent, BuscarComponent, HttpClientModule, ImagenComponent],
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {
  actividades: Actividades[] = [];
  actividadesFiltradas: Actividades[] = [];

  constructor(
    private actividadesService: ActividadesService,
    private loadingService: LoadingService) { }

 ngOnInit(): void {
  this.loadingService.show();

  this.actividadesService.obtenerActividades()
    .pipe(
      finalize(() => this.loadingService.hide()) 
    )
    .subscribe({
      next: (data) => {
        this.actividades = data;
        this.actividadesFiltradas = [...this.actividades];
      },
      error: (err) => {
        console.error('Error al obtener actividades:', err);
      }
    });
}


  buscando: boolean = false;
  mensaje: string = '';

  filtrarActividades(texto: string): void {
    this.buscando = true;
    const textoNormalizado = texto.toLowerCase();
    this.actividadesFiltradas = this.actividades.filter(act =>
      act.nombre.toLowerCase() === textoNormalizado
    );

    this.mensaje = this.actividadesFiltradas.length === 0
      ? 'No se encontró ninguna actividad con ese nombre.'
      : '';
  }

  verTodas(): void {
    this.actividadesFiltradas = [...this.actividades];
    this.mensaje = '';
    this.buscando = false;
  }

}
