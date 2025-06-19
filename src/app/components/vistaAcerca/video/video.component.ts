import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VideoseguroPipe } from './videoseguro.pipe';

@Component({
  selector: 'app-video',
  imports: [RouterModule, VideoseguroPipe],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent {
  title = 'DGLJ_PipeDomSanitizer';

  video:string="lkOZd3vWpa8";
}
