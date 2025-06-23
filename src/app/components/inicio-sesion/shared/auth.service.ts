import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'admin' | 'user';
export interface UserInfo {
  name: string;
  role: 'admin' | 'user';  // Aquí defines el role
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInUser = new BehaviorSubject<UserInfo | null>(null);
  user$ = this.loggedInUser.asObservable();

  private readonly ADMIN_USERS = ['admin', 'administrador']; // Lista de usuarios admin

  login(name: string, role: 'admin' | 'user') {
    this.loggedInUser.next({ name, role });
  }



  logout() {
    this.loggedInUser.next(null);
  }

  getCurrentUser(): UserInfo | null {
    return this.loggedInUser.getValue();
  }

  isAdmin(): boolean {
    return this.loggedInUser.getValue()?.role === 'admin';
  }
}