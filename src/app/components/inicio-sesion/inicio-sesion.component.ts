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
import { AdminLoginResponse, AdminService } from './shared/admin.service';
import { FireauthService } from './shared/fireauth.service';
import { MatSelectModule } from '@angular/material/select';

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
    MatIconModule,
    MatSelectModule
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
  activeTab: 'login' | 'register' | 'userLogin' = 'login';

  // Campos de registro
  regUsername = '';
  regEmail = '';
  regPassword = '';
  regConfirmPassword: string = '';
  regPhone: string = '';  
  regSocial: string = '';

  constructor(
    private adminService: AdminService,
    private dialogRef: MatDialogRef<InicioSesionComponent>,
    private authService: AuthService,
    private fireAuth: FireauthService
  ) { }



  // Para login usuario
authMethod: 'password' | 'sms' | 'social' = 'password';
userUsername = '';
userPassword = '';
telefono = '';
socialAccount = '';

// Cambiar vista desde registro a login usuario
// Cambiar vista desde registro a login usuario
showUserLogin(method: 'password' | 'sms' | 'social' = 'password') {
  this.activeTab = 'userLogin';
  this.authMethod = method;
}
// Login usuario por contraseña
onUserLogin(): void {
  // Aquí llamas a FireauthService.loginUsuario()
  Swal.fire({
    title: '¡Login usuario!',
    text: `Usuario: ${this.userUsername}`,
    icon: 'info'
  });
}

// Login vía SMS
onSmsLogin(): void {
  Swal.fire({
    title: 'Inicio SMS',
    text: `Teléfono: ${this.telefono}`,
    icon: 'info'
  });
}

// Login red social
onSocialLogin(): void {
  Swal.fire({
    title: 'Inicio con Red Social',
    text: `Cuenta: ${this.socialAccount}`,
    icon: 'info'
  });
}


  closeDialog(): void {
    this.dialogRef.close();
  }

  onRegister(): void {
    const usernameTrimmed = this.regUsername.trim();
    const passwordTrimmed = this.regPassword.trim();
    const confirmPasswordTrimmed = this.regConfirmPassword.trim();
    const emailTrimmed = this.regEmail.trim();

    const passwordRegex = /^[A-Za-z0-9_]{8,20}$/;
    const hasUpperCase = /[A-Z]/.test(passwordTrimmed);
    const hasDigit = /\d/.test(passwordTrimmed);

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

    if (!passwordRegex.test(passwordTrimmed)) {
      Swal.fire({
        icon: 'warning',
        title: 'Formato inválido',
        html: 'La contraseña debe tener entre <b>8 y 20 caracteres</b> y solo puede contener <b>letras</b>, <b>dígitos</b> y el símbolo <b>_</b>.',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#FFA500',
        confirmButtonColor: '#A9745D',
        confirmButtonText: 'Ok'
      });
      return;
    }

    if (!hasUpperCase || !hasDigit) {
      Swal.fire({
        icon: 'warning',
        title: 'Requisitos de seguridad',
        text: 'La contraseña debe contener al menos una letra mayúscula y un número.',
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

    const nuevoUsuario = {
      nombre: usernameTrimmed,
      usuario: usernameTrimmed,
      email: emailTrimmed,
      password: passwordTrimmed,
      confirmPassword: confirmPasswordTrimmed,
      telefono: this.regPhone.trim(),       
      redSocial: this.regSocial.trim()     
    };

    this.fireAuth.registrarUsuario(nuevoUsuario).subscribe({
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
          text:` Bienvenido ${res.nombre}`,
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