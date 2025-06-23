import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

export interface AdminLoginResponse {
  nombre: string;
  usuario: string;
  email: string;
  img?: string;
  role: 'admin';
  bloqueado?: boolean;
  intentosFallidos?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://proyectofinalnodejs.onrender.com/api'; // Ajusta según tu configuración

  constructor(private http: HttpClient) { }

  login(payload: { nombre: string, usuario: string, password: string }): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/login-superusuario`, payload).pipe(
      map(response => {
        if (response.bloqueado) {
          throw { 
            error: { 
              bloqueado: true, 
              intentosFallidos: response.intentosFallidos,
              email: response.email
            } 
          };
        }
        return response;
      }),
      catchError(error => {
        if (error.error?.bloqueado) {
          this.mostrarAlertaBloqueo(error.error.intentosFallidos, payload.usuario, error.error.email);
        } 
        else if (error.error?.error === 'Credenciales incorrectas' || error.status === 401) {
          this.manejarIntentoFallido(payload.usuario, error.error.intentosFallidos);
        }
        return throwError(error);
      })
    );
  }
  // En tu admin.service.ts, añade este nuevo método
  getUserEmail(username: string): Observable<string> {
    return this.http.get<{email: string}>(`${this.apiUrl}/get-user-email?usuario=${username}`).pipe(
      map(response => response.email),
      catchError(error => {
        console.error('Error al obtener email:', error);
        return throwError(error);
      })
    );
  }

  private mostrarAlertaBloqueo(intentosFallidos: number, username: string, email: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Cuenta Bloqueada',
      html: `
        <p>Tu cuenta ha sido bloqueada después de ${intentosFallidos || 3} intentos fallidos.</p>
        <p>Hemos enviado un enlace de recuperación al correo asociado (${email}).</p>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Recuperar Cuenta',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      background: '#fffaf3',
      color: '#5B4C3A',
      iconColor: '#B23B3B',
      confirmButtonColor: '#A9745D'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mostrarDialogoRecuperacion(username, email);
      }
    });
  }

  unlockAccount(username: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/unlock-account`, {
      usuario: username,
      nuevaPassword: newPassword
    });
  }

  sendRecoveryEmail(email: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-recovery-email`, {
      email,
      usuario: username
    });
  }

  private manejarIntentoFallido(username: string, intentosActuales: number): void {
    const intentosRestantes = 3 - (intentosActuales || 0);
    
    Swal.fire({
      icon: 'warning',
      title: 'Credenciales incorrectas',
      text: `Te quedan ${intentosRestantes} intentos antes de que tu cuenta sea bloqueada.`,
      background: '#fffaf3',
      color: '#5B4C3A',
      iconColor: '#FFA500',
      confirmButtonColor: '#A9745D'
    });
  }

  private mostrarDialogoRecuperacion(username: string, email: string): void {
    Swal.fire({
      title: 'Recuperar Cuenta',
      html: `
        <p>Ingresa tu correo electrónico para enviar las instrucciones de recuperación:</p>
        <input id="recovery-email" class="swal2-input" placeholder="Correo electrónico" type="email">
      `,
      focusConfirm: false,
      background: '#fffaf3',
      color: '#5B4C3A',
      confirmButtonColor: '#A9745D',
      preConfirm: () => {
        const email = (document.getElementById('recovery-email') as HTMLInputElement)?.value;
        if (!email) {
          Swal.showValidationMessage('El correo es requerido');
          return;
        }
        return { email };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value?.email) {
        this.sendRecoveryEmail(result.value.email, username).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Correo enviado',
              text: 'Hemos enviado las instrucciones para recuperar tu cuenta.',
              background: '#fffaf3',
              color: '#5B4C3A',
              confirmButtonColor: '#A9745D'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo enviar el correo de recuperación. Intenta nuevamente.',
              background: '#fffaf3',
              color: '#5B4C3A',
              confirmButtonColor: '#A9745D'
            });
          }
        });
      }
    });
  }

  public showPasswordChangeDialog(username: string): void {
    Swal.fire({
      title: 'Cambiar Contraseña',
      html: `
        <p>Ingresa y confirma tu nueva contraseña:</p>
        <input id="new-password" class="swal2-input" placeholder="Nueva contraseña" type="password">
        <input id="confirm-password" class="swal2-input" placeholder="Confirmar contraseña" type="password">
      `,
      focusConfirm: false,
      background: '#fffaf3',
      color: '#5B4C3A',
      confirmButtonColor: '#A9745D',
      preConfirm: () => {
        const newPassword = (document.getElementById('new-password') as HTMLInputElement)?.value;
        const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement)?.value;

        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage('Ambos campos son requeridos');
          return;
        }

        if (newPassword.length < 6) {
          Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres');
          return;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Las contraseñas no coinciden');
          return;
        }

        return { newPassword };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value?.newPassword) {
        this.unlockAccount(username, result.value.newPassword).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Contraseña cambiada',
              text: 'Tu cuenta ha sido desbloqueada. Por favor inicia sesión con tu nueva contraseña.',
              background: '#fffaf3',
              color: '#5B4C3A',
              confirmButtonColor: '#A9745D'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo cambiar la contraseña. Intenta nuevamente.',
              background: '#fffaf3',
              color: '#5B4C3A',
              confirmButtonColor: '#A9745D'
            });
          }
        });
      }
    });
  }
}