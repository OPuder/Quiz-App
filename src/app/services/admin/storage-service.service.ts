import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

   getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  getUserList(): any[] {
    const users = localStorage.getItem('userList');
    return users ? JSON.parse(users) : [];
  }

  addUser(user: any): void {
    const users = this.getUserList();
    users.push(user);
    this.setItem('userList', JSON.stringify(users));
  }

 
  removeUser(email: string): void {
    let users = this.getUserList();
    users = users.filter((user: any) => user.email !== email);
    this.setItem('userList', JSON.stringify(users));
  }
}
