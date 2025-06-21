import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, catchError, of, delay } from 'rxjs';
import { Actividades } from './actividades';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  apiUrl = 'https://hotelactividades.free.beeceptor.com/';

  constructor(private http: HttpClient) {}

  obtenerActividades(): Observable<Actividades[]> {
  return this.http.get<{ actividades: Actividades[] }>(this.apiUrl).pipe(
    delay(5000), // 2 segundos de carga
    map(response => response.actividades),
    catchError(this.handleError<Actividades[]>('obtenerActividades', []))
  );
}

  obtenerActividadPorId(id: number): Observable<Actividades | undefined> {
    return this.obtenerActividades().pipe(
      map(actividades => actividades.find(actividad => actividad.id === id)),
      catchError(this.handleError<Actividades | undefined>(`obtenerActividadPorId id=${id}`, undefined))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}