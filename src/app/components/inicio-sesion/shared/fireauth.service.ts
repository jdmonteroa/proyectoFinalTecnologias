import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class FireauthService {

  constructor(private auth: Auth) {}
  recaptchaVerifier!: RecaptchaVerifier;

  /**
   * Login con correo y contraseña
   */
  loginUsuario(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * Registro con correo y contraseña
   */
  registrarUsuario(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * Login con Google
   */
  loginConGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  /**
   * Inicializar reCAPTCHA invisible
  */
  initRecaptcha(containerId: string): void {
    const container = document.getElementById(containerId);
  
    if (!container) {
      console.error('No se encontró el contenedor para el reCAPTCHA');
      return;
    }
  
    this.recaptchaVerifier = new RecaptchaVerifier(this.auth, container, {
      size: 'invisible',
    });
  }
  
  
  
  
  

  /**
   * Enviar código SMS
  */
  enviarCodigo(telefono: string): Observable<ConfirmationResult> {
    return from(signInWithPhoneNumber(this.auth, telefono, this.recaptchaVerifier));
  }

  /**
   * Confirmar código SMS
  */
  confirmarCodigo(result: ConfirmationResult, codigo: string): Observable<UserCredential> {
    return from(result.confirm(codigo));
  }


  /**
   * Cerrar sesión
   */
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
