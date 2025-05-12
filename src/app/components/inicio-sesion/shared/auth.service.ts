import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'admin' | 'user';
export interface UserInfo {
  name: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private loggedInUser = new BehaviorSubject<UserInfo | null>(null);
  user$ = this.loggedInUser.asObservable();

  private readonly ADMIN_USERS = ['admin', 'administrador']; // Lista de usuarios admin

  login(username: string, name: string) {
    const role = this.ADMIN_USERS.includes(username.toLowerCase()) ? 'admin' : 'user';
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