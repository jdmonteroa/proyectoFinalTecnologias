import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  id?: string;
  Fechallegada: string;
  fechasalida: string;
  huespedes: number;
  metodopago: string;
  nombre: string;
  tipohabitacion: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private apiUrl = 'http://localhost:3000/api/reservas'; // url del api

  constructor(private http: HttpClient) { }

  // Obtener todas las reservas
  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  // Obtener reserva por id
  getReserva(id: string): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva reserva
  crearReserva(reserva: Reserva): Observable<{mensaje: string, id: string}> {
    return this.http.post<{mensaje: string, id: string}>(this.apiUrl, reserva);
  }

  // Actualizar reserva existente
  actualizarReserva(id: string, reserva: Reserva): Observable<{mensaje: string}> {
    return this.http.put<{mensaje: string}>(`${this.apiUrl}/${id}`, reserva);
  }

  // Eliminar reserva por id
  eliminarReserva(id: string): Observable<{mensaje: string}> {
    return this.http.delete<{mensaje: string}>(`${this.apiUrl}/${id}`);
  }
}

