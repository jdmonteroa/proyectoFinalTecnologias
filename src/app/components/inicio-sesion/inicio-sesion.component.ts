import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Admin } from './admin';
import { AdminService } from './shared/admin.service';
import { AuthService } from './shared/auth.service';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-inicio-sesion',
  imports: [RouterModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {
  username: string = '';
  password: string = '';
  nombre: string = '';
  hidePassword: boolean = true;

  constructor(
    private adminService: AdminService,
    private dialogRef: MatDialogRef<InicioSesionComponent>,
    private authService: AuthService
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const admins: Admin[] = this.adminService.getAdmin();

    const encontrado = admins.find(admin =>
      admin.usuario === this.username &&
      admin.contrasena === this.password &&
      admin.nombre.trim().toLowerCase() === this.nombre.trim().toLowerCase()
    );
    if (encontrado) {
      this.authService.login(this.username, encontrado.nombre); // Guarda el nombre
      Swal.fire({
        title: '¡Inicio de sesión exitoso!',
        text: 'Bienvenido, has ingresado correctamente.',
        icon: 'success',
        background: '#fffaf3',         // Fondo claro
        color: '#5B4C3A',              // Texto café
        iconColor: '#5B4C3A',          // Ícono verde estilo café
        confirmButtonColor: '#A9745D', // Botón café fuerte
        confirmButtonText: 'Continuar'
      });
      this.dialogRef.close(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        text: 'Verifica tu nombre, usuario o contraseña.',
        background: '#fffaf3',         // Fondo claro estilo beige
        color: '#5B4C3A',              // Texto color café
        iconColor: '#B23B3B',          // Ícono rojo oscuro
        confirmButtonColor: '#A9745D', // Botón café fuerte
        confirmButtonText: 'Entendido'
      });

    }
  }
}