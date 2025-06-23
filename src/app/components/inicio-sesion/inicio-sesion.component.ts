import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { AuthService } from './shared/auth.service';
import { AdminLoginResponse, AdminService } from './shared/admin.service';
import { FireauthService } from './shared/fireauth.service';
import { ConfirmationResult, updateProfile } from 'firebase/auth';

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
export class InicioSesionComponent{
  // Login campos
  username: string = '';
  password: string = '';
  nombre: string = '';
  hidePassword: boolean = true;
  loginAttempts: number = 0;
  isAccountLocked: boolean = false;
  maxAttempts: number = 3;

  telefono: string = '';
  codigo: string = '';
  confirmationResult!: ConfirmationResult;

  @ViewChild('recaptchaDiv', { static: false }) recaptchaDiv!: ElementRef;

  userEmail: string = '';
  userPassword: string = '';

  activeTab: 'login' | 'register' | 'userLogin' = 'login';

  regUsername = '';
  regEmail = '';
  regPassword = '';
  regConfirmPassword: string = '';
  regPhone: string = '';
  regSocial: string = '';

  authMethod: 'password' | 'sms' | 'social' = 'password';
  userUsername = '';

  constructor(
    private adminService: AdminService,
    private dialogRef: MatDialogRef<InicioSesionComponent>,
    private authService: AuthService,
    private fireAuth: FireauthService
  ) { }

  showUserLogin(method: 'password' | 'sms' | 'social' = 'password') {
    this.activeTab = 'userLogin';
    this.authMethod = method;
  }

  onUserLogin(): void {
    const emailTrimmed = this.userEmail.trim();
    const passwordTrimmed = this.userPassword.trim();

    if (!emailTrimmed || !passwordTrimmed) {
      Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Debes ingresar el correo y la contraseña.' });
      return;
    }

    this.fireAuth.loginUsuario(emailTrimmed, passwordTrimmed).subscribe({
      next: (cred) => {
        const nombreUsuario = cred.user.displayName || 'Usuario';
        Swal.fire({ icon: 'success', title: `¡Bienvenido, ${nombreUsuario}!`, text: 'Has iniciado sesión exitosamente.' });
        this.authService.login(nombreUsuario, 'user');
        this.dialogRef.close(true);
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Error al iniciar sesión', text: 'Correo o contraseña incorrectos.' });
      }
    });
  }

  onGoogleLogin() {
    this.fireAuth.loginConGoogle().subscribe({
      next: (cred) => {
        const user = cred.user;
        const nombreUsuario = user.displayName || 'Usuario';

        this.authService.login(nombreUsuario, 'user');

        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido, ${nombreUsuario}!`,
          text: 'Has iniciado sesión exitosamente con Google.'
        });

        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al iniciar sesión con Google:', err);
        Swal.fire({ icon: 'error', title: 'Error al iniciar sesión', text: 'Hubo un problema con Google. Inténtalo de nuevo.' });
      }
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
      Swal.fire({ icon: 'warning', title: 'Nombre muy corto', text: 'El nombre de usuario debe tener al menos 6 caracteres.' });
      return;
    }

    if (!passwordRegex.test(passwordTrimmed) || !hasUpperCase || !hasDigit) {
      Swal.fire({ icon: 'warning', title: 'Contraseña inválida', html: 'Debe tener entre 8 y 20 caracteres, una mayúscula y un número.' });
      return;
    }

    if (passwordTrimmed !== confirmPasswordTrimmed) {
      Swal.fire({ icon: 'error', title: 'Contraseñas no coinciden', text: 'Asegúrate de que ambas contraseñas sean iguales.' });
      return;
    }

    this.fireAuth.registrarUsuario(emailTrimmed, passwordTrimmed).subscribe({
      next: (cred) => {
        updateProfile(cred.user, {
          displayName: usernameTrimmed
        }).then(() => {
          Swal.fire({ icon: 'success', title: 'Registro exitoso', text: 'Tu cuenta ha sido creada correctamente.' });
          this.dialogRef.close(true);
        }).catch(() => {
          Swal.fire({ icon: 'error', title: 'Error al guardar nombre', text: 'El usuario fue registrado, pero el nombre no se guardó correctamente.' });
        });
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Error al registrar', text: 'Ocurrió un problema al crear tu cuenta. Intenta más tarde.' });
      }
    });
  }

  onSubmit(): void {
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
      error: (err) => {
        if (err.error?.bloqueado) {
          this.isAccountLocked = true;
          this.loginAttempts = this.maxAttempts;
          Swal.fire({
            icon: 'error',
            title: 'Cuenta bloqueada',
            text: 'Tu cuenta ha sido bloqueada por intentos fallidos. Revisa tu correo para recuperarla.',
            background: '#fffaf3',
            color: '#5B4C3A',
            iconColor: '#B23B3B',
            confirmButtonColor: '#A9745D',
            confirmButtonText: 'Entendido'
          });
        } else if (err.status === 401) {
          this.loginAttempts = err.error?.intentosFallidos || this.loginAttempts + 1;
          const intentosRestantes = this.maxAttempts - this.loginAttempts;
          if (intentosRestantes <= 0) this.isAccountLocked = true;
          Swal.fire({
            icon: 'warning',
            title: 'Credenciales incorrectas',
            text: `Intentos restantes: ${intentosRestantes}`,
            background: '#fffaf3',
            color: '#5B4C3A',
            iconColor: '#FFA500',
            confirmButtonColor: '#A9745D',
            confirmButtonText: 'Intentar nuevamente'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error desconocido',
            text: 'Ocurrió un error inesperado. Intenta más tarde.',
            background: '#fffaf3',
            color: '#5B4C3A',
            iconColor: '#B23B3B',
            confirmButtonColor: '#A9745D',
            confirmButtonText: 'Entendido'
          });
        }
      }
    });
  }

  public showUnlockAccountDialog(): void {
    this.adminService.getUserEmail(this.username.trim()).subscribe({
      next: (email: any) => {
        Swal.fire({
          title: 'Cuenta Bloqueada',
          html: `
            <p>Tu cuenta ha sido bloqueada debido a múltiples intentos fallidos.</p>
            <p>Hemos enviado un enlace de recuperación a: <strong>${email}</strong></p>
            <p>Para desbloquearla, por favor cambia tu contraseña.</p>
            <input id="new-password" type="password" class="swal2-input" placeholder="Nueva contraseña">
            <input id="confirm-password" type="password" class="swal2-input" placeholder="Confirmar contraseña">
          `,
          icon: 'warning',
          background: '#fffaf3',
          color: '#5B4C3A',
          iconColor: '#B23B3B',
          confirmButtonColor: '#A9745D',
          confirmButtonText: 'Cambiar contraseña',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const newPassword = (document.getElementById('new-password') as HTMLInputElement).value;
            const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;

            if (!newPassword || !confirmPassword) {
              Swal.showValidationMessage('Ambos campos son requeridos');
              return false;
            }

            if (newPassword !== confirmPassword) {
              Swal.showValidationMessage('Las contraseñas no coinciden');
              return false;
            }

            return { newPassword };
          }
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            this.adminService.unlockAccount(this.username.trim(), result.value.newPassword).subscribe({
              next: () => {
                this.isAccountLocked = false;
                this.loginAttempts = 0;
                Swal.fire({
                  title: 'Contraseña cambiada',
                  text: 'Tu cuenta ha sido desbloqueada. Por favor inicia sesión con tu nueva contraseña.',
                  icon: 'success',
                  background: '#fffaf3',
                  color: '#5B4C3A',
                  iconColor: '#5B4C3A',
                  confirmButtonColor: '#A9745D',
                  confirmButtonText: 'Entendido'
                });
              },
              error: () => {
                Swal.fire({
                  title: 'Error',
                  text: 'Ocurrió un error al cambiar la contraseña. Intenta nuevamente.',
                  icon: 'error',
                  background: '#fffaf3',
                  color: '#5B4C3A',
                  iconColor: '#B23B3B',
                  confirmButtonColor: '#A9745D',
                  confirmButtonText: 'Entendido'
                });
              }
            });
          }
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener la información de la cuenta.',
          icon: 'error',
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
