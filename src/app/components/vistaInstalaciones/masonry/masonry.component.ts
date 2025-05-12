import { Component } from '@angular/core';

@Component({
  selector: 'app-masonry',
  imports: [],
  templateUrl: './masonry.component.html',
  styleUrl: './masonry.component.css'
})
export class MasonryComponent {
  images: string[] = [
      '/img/img1.jpg',
      '/img/img2.jpg',
      '/img/img3.jpg',
      '/img/img4.jpg',
      '/img/img5.jpg',
      '/img/img6.jpg',
      '/img/img7.jpg',
      '/img/img8.jpg',
      '/img/img9.jpg',
      '/img/img10.jpg',
    ];
  
    repeatFactor = 5;
    animationDuration = 200;
  
    get rows(): string[][] {
      const repeated = Array(this.repeatFactor).fill(this.images).flat();
      const row1: string[] = [];
      const row2: string[] = [];
  
      repeated.forEach((img, i) => {
        (i % 2 === 0 ? row1 : row2).push(img);
      });
  
      return [row1, row2];
    }
}
