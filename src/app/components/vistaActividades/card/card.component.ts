import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() nombre!: string;
  @Input() descripcion!: string;
  @Input() imagen!: string;
  @Input() idActividad!: number;
}
