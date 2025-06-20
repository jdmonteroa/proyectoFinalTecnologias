import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private apiUrl = 'http://localhost:3000/api/contactos';

  constructor(private http: HttpClient) {}

  guardarContacto(contacto: any) {
    return this.http.post(this.apiUrl, contacto);
  }
}

