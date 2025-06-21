import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminLoginResponse {
  nombre: string;
  usuario: string;
  img?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api'; // Cambia si usas una URL diferente

  constructor(private http: HttpClient) { }

  login(payload: { nombre: string, usuario: string, password: string }): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/login-superusuario`, payload);
  }
}

