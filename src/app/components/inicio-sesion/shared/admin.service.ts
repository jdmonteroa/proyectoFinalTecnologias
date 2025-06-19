import { Injectable } from '@angular/core';
import { Admin } from '../admin';
import { ADMIS } from '../misadmis';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private admin:Admin[]=ADMIS;

  constructor() { }

  getAdmin(): Admin[] {
    return this.admin;
  } 
  
}