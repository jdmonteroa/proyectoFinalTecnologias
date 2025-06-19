import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { InicioSesionComponent } from '../inicio-sesion/inicio-sesion.component';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, UserInfo } from '../inicio-sesion/shared/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  usuarioActual: UserInfo | null = null;

  constructor(private dialog: MatDialog, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.usuarioActual = user;
    });
  }

  openLoginModal() {
    const dialogRef = this.dialog.open(InicioSesionComponent, {
      width: '540px',
      height: '460px',
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      disableClose: false,
      autoFocus: false
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo cerrado');
    });
  }

  cerrarSesion() {
    this.authService.logout();
    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      showConfirmButton: false,
      timer: 1500
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}