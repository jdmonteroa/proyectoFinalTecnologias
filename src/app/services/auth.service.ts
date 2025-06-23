import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Ajusta si usas otro puerto/backend

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token); // Guarda token
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Retorna true si hay token
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
