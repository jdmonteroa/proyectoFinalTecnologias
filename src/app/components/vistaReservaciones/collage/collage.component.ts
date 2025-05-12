import { Component } from '@angular/core';

@Component({
  selector: 'app-collage',
  imports: [],
  templateUrl: './collage.component.html',
  styleUrl: './collage.component.css'
})
export class CollageComponent {
  images = [
    'img/collage1.jpeg',
    'img/collage2.jpeg',
    'img/collage3.jpeg'
  ];

  selectedImage = this.images[0]; // Mostrar la primera al cargar

  selectImage(img: string) {
    this.selectedImage = img;
  }
}
