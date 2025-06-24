import { Injectable } from '@angular/core'; 
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, 
  UserCredential,GoogleAuthProvider,signInWithPopup} from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FireauthService {
  constructor(private auth: Auth) {}

  /*Login con correo y contraseña*/
  loginUsuario(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /*Registro con correo y contraseña*/
  registrarUsuario(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  /*Login con Google*/
  loginConGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  /*Cerrar sesión*/
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}


