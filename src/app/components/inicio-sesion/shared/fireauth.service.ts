import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireauthService {
  private apiURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  registrarUsuario(data: {
    nombre: string;
    usuario: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiURL}/registrar-usuario`, data);
  }
}