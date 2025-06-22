import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../inicio-sesion/shared/auth.service';
import { CommonModule } from '@angular/common';
import { AccessibilityWidgetComponent } from '../../accessibility-widget/accessibility-widget.component';


@Component({
  selector: 'app-navbar',
  imports: [RouterModule, MatIconModule, CommonModule,AccessibilityWidgetComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  
  // Propiedad computada
  get user$() {
    return this.authService.user$;
  }

  fontFamily: string = 'Arial';
  fontSize: string = '16px';
  isHighContrast: boolean = false;
  isLargeText: boolean = false;

  menuAbierto: boolean = false;



  updateFont(newFont: string) {
    this.fontFamily = newFont;
    document.body.style.fontFamily = newFont;
  }

  toggleLargeText(isOn: boolean) {
    this.isLargeText = isOn;
    document.body.classList.toggle('large-text', isOn);
  }

  toggleContrast(isOn: boolean) {
    this.isHighContrast = isOn;
    document.body.classList.toggle('high-contrast', isOn);
  }
}
