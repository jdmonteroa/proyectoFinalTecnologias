import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactoComponent } from '../contacto/contacto.component';
import { CardsVisionComponent } from '../cards-vision/cards-vision.component';
import { VideoComponent } from '../video/video.component';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acerca',
  imports: [RouterOutlet,ContactoComponent,CardsVisionComponent, VideoComponent, CommonModule],
  templateUrl: './acerca.component.html',
  styleUrl: './acerca.component.css'
})
export class AcercaComponent {
    isLoggedIn = false; // new property to track login status

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
}
