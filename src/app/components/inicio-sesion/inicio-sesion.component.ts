import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import Swal from 'sweetalert2';
import { AuthService } from './shared/auth.service';
import { AdminLoginResponse, AdminService} from './shared/admin.service';
import { Usuario, UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {
  // Campos de login
  username: string = '';
  password: string = '';
  nombre: string = '';
  hidePassword: boolean = true;

  // Control de pestañas
  activeTab: 'login' | 'register' = 'login';

  // Campos de registro
  regUsername = '';
  regEmail = '';
  regPassword = '';
  regConfirmPassword: string = '';

  constructor(
    private adminService: AdminService,
    private dialogRef: MatDialogRef<InicioSesionComponent>,
    private authService: AuthService,
    private userService: UsuarioService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  onRegister(): void {
  const usernameTrimmed = this.regUsername.trim();
  const passwordTrimmed = this.regPassword.trim();
  const confirmPasswordTrimmed = this.regConfirmPassword.trim();

  if (usernameTrimmed.length < 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Nombre muy corto',
      text: 'El nombre de usuario debe tener al menos 6 caracteres.',
      background: '#fffaf3',
      color: '#5B4C3A',
      iconColor: '#FFA500',
      confirmButtonColor: '#A9745D',
      confirmButtonText: 'Ok'
    });
    return;
  }

  if (passwordTrimmed.length < 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Contraseña muy corta',
      text: 'La contraseña debe tener al menos 6 caracteres.',
      background: '#fffaf3',
      color: '#5B4C3A',
      iconColor: '#FFA500',
      confirmButtonColor: '#A9745D',
      confirmButtonText: 'Ok'
    });
    return;
  }

  if (passwordTrimmed !== confirmPasswordTrimmed) {
    Swal.fire({
      icon: 'error',
      title: 'Contraseñas no coinciden',
      text: 'Asegúrate de que ambas contraseñas sean iguales.',
      background: '#fffaf3',
      color: '#5B4C3A',
      iconColor: '#B23B3B',
      confirmButtonColor: '#A9745D',
      confirmButtonText: 'Revisar'
    });
    return;
  }

  const nuevoUsuario: Usuario = {
    username: usernameTrimmed,     
    email: this.regEmail.trim(),
    password: passwordTrimmed
  };


  this.userService.registrarUsuario(nuevoUsuario).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta ha sido creada correctamente.',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#5B4C3A',
        confirmButtonColor: '#A9745D',
        confirmButtonText: 'Aceptar'
      });
      this.dialogRef.close(true); 
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'Ocurrió un problema al crear tu cuenta. Intenta más tarde.',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#B23B3B',
        confirmButtonColor: '#A9745D',
        confirmButtonText: 'Cerrar'
      });
    }
  });
}


  onSubmit(): void {
    // Validación básica
    if (!this.nombre.trim() || !this.username.trim() || !this.password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Debes llenar todos los campos para continuar.',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#FFA500',
        confirmButtonColor: '#A9745D',
        confirmButtonText: 'Ok'
      });
      return;
    }

    const payload = {
      nombre: this.nombre.trim(),
      usuario: this.username.trim(),
      password: this.password.trim()
    };

    this.adminService.login(payload).subscribe({
      next: (res: AdminLoginResponse) => {
        this.authService.login(res.usuario, res.nombre);
        Swal.fire({
          title: '¡Inicio de sesión exitoso!',
          text: `Bienvenido ${res.nombre}`,
          icon: 'success',
          background: '#fffaf3',
          color: '#5B4C3A',
          iconColor: '#5B4C3A',
          confirmButtonColor: '#A9745D',
          confirmButtonText: 'Continuar'
        });
        this.dialogRef.close(true);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'Verifica tu nombre, usuario o contraseña.',
          background: '#fffaf3',
          color: '#5B4C3A',
          iconColor: '#B23B3B',
          confirmButtonColor: '#A9745D',
          confirmButtonText: 'Entendido'
        });
      }
    });
  }
}
