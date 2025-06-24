import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

import Swal from 'sweetalert2';
import { AuthService } from './shared/auth.service';
import { AdminLoginResponse, AdminService } from './shared/admin.service';
import { FireauthService } from './shared/fireauth.service';
import { MatSelectModule } from '@angular/material/select';
import { updateProfile } from 'firebase/auth';
import { ConfirmationResult } from 'firebase/auth';



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
    MatSelectModule,
    ReactiveFormsModule
],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent implements OnInit {
  // Campos de login
  username: string = '';
  password: string = '';
  nombre: string = '';
  hidePassword: boolean = true;

  telefono: string = '';
  codigoSMS: string = '';
  confirmationResult!: ConfirmationResult;
  socialAccount: string = 'google';

  userEmail: string = '';
  userPassword: string = '';

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

  ngOnInit(): void {
    this.fireAuth.initRecaptcha('recaptcha-container');
  }

  // Para login usuario
  authMethod: 'password' | 'sms' | 'social' = 'password';
  userUsername = '';

  // Cambiar vista desde registro a login usuario
  // Cambiar vista desde registro a login usuario
  showUserLogin(method: 'password' | 'sms' | 'social' = 'password') {
    this.activeTab = 'userLogin';
    this.authMethod = method;
  }
  // Login usuario por contraseña
  onUserLogin(): void {
    const emailTrimmed = this.userEmail.trim();
    const passwordTrimmed = this.userPassword.trim();

    if (!emailTrimmed || !passwordTrimmed) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Debes ingresar el correo y la contraseña.'
      });
      return;
    }

    this.fireAuth.loginUsuario(emailTrimmed, passwordTrimmed).subscribe({
      next: (cred) => {
        const nombreUsuario = cred.user.displayName || 'Usuario';

        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido, ${nombreUsuario}!`,
          text: 'Has iniciado sesión exitosamente.'
        });
        
        //login usuario normal
        this.authService.login(nombreUsuario, 'user'); 
        this.dialogRef.close(true);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'Correo o contraseña incorrectos.'
        });
      }
    });
  }

  // ✅ LOGIN POR SMS
  onSmsLogin(): void {
    this.fireAuth.enviarCodigo(this.telefono).subscribe({
      next: (result) => {
        this.confirmationResult = result;
        Swal.fire('Código enviado', 'Revisa tu SMS e ingresa el código.', 'info');
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo enviar el código: ' + err.message, 'error');
      }
    });
  }

  confirmarCodigo(): void {
    this.fireAuth.confirmarCodigo(this.confirmationResult, this.codigoSMS).subscribe({
      next: (cred) => {
        Swal.fire('¡Listo!', 'Inicio de sesión exitoso con teléfono.', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'Código incorrecto: ' + err.message, 'error');
      }
    });
  }

  // ✅ LOGIN CON GOOGLE
  onSocialLogin(): void {
    if (this.socialAccount === 'google') {
      this.fireAuth.loginConGoogle().subscribe({
        next: (cred) => {
          Swal.fire('¡Bienvenido!', 'Inicio de sesión exitoso con Google.', 'success');
        },
        error: (err) => {
          Swal.fire('Error', 'Fallo con Google: ' + err.message, 'error');
        }
      });
    }
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
      Swal.fire({ icon: 'warning', title: 'Nombre muy corto', text: 'El nombre de usuario debe tener al menos 6 caracteres.' });
      return;
    }

    if (!passwordRegex.test(passwordTrimmed) || !hasUpperCase || !hasDigit) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña inválida',
        html: 'Debe tener entre 8 y 20 caracteres, una mayúscula y un número.'
      });
      return;
    }

    if (passwordTrimmed !== confirmPasswordTrimmed) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Asegúrate de que ambas contraseñas sean iguales.'
      });
      return;
    }

    this.fireAuth.registrarUsuario(emailTrimmed, passwordTrimmed).subscribe({
      next: (cred) => {
        updateProfile(cred.user, {
          displayName: usernameTrimmed
        }).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Tu cuenta ha sido creada correctamente.'
          });
          this.dialogRef.close(true);
        }).catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar nombre',
            text: 'El usuario fue registrado, pero el nombre no se guardó correctamente.'
          });
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'Ocurrió un problema al crear tu cuenta. Intenta más tarde.'
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
        this.authService.login(res.nombre, 'admin');
        Swal.fire({
          title: '¡Inicio de sesión exitoso!',
          text: ` Bienvenido ${res.nombre}`,
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