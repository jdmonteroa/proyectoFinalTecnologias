import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { Actividades } from '../actividades';
import { ActividadesService } from '../actividades.service';

@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [HttpClientModule, RouterModule],
  templateUrl: './actividad.component.html',
  styleUrl: './actividad.component.css'
})
export class ActividadComponent implements OnInit {
  actividad?: Actividades;

  constructor(
    private route: ActivatedRoute,
    private actividadesService: ActividadesService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.actividadesService.obtenerActividadPorId(id).subscribe((data) => {
      this.actividad = data;
    });
  }
}