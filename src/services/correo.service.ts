import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {
  private apiUrl = 'http://localhost:3000/api/enviar-correo';

  constructor(private http: HttpClient) {}

  enviarCorreo(data: { correo: string; nombre: string; apellido: string; mensaje: string }) {
    return this.http.post(this.apiUrl, data);
  }
}

