import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Contacto {
  id?: string;
  nombre: string;
  apellidos: string;
  correo: string;
  Mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private apiUrl = 'http://localhost:3000/api/contactos';

  constructor(private http: HttpClient) {}

  // Crear nuevo contacto
  guardarContacto(contacto: Contacto): Observable<{ mensaje: string; id: string }> {
    return this.http.post<{ mensaje: string; id: string }>(this.apiUrl, contacto);
  }

  // Obtener todos los contactos
  obtenerContactos(): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(this.apiUrl);
  }

  // Obtener contacto por id
  obtenerContacto(id: string): Observable<Contacto> {
    return this.http.get<Contacto>(`${this.apiUrl}/${id}`);
  }

  // Actualizar contacto
  actualizarContacto(id: string, contacto: Contacto): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, contacto);
  }

  // Eliminar contacto
  eliminarContacto(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }
}


