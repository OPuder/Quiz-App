import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { initialUsers } from '../../shared/data/user';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly USER_STORAGE_KEY = 'users';
  private users: User[] = [];
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedUsers = localStorage.getItem(this.USER_STORAGE_KEY);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      this.users = initialUsers;
      this.saveUsers();
      console.warn('Standard-Admin wurde automatisch erstellt:', initialUsers[0]);
    }
  }

  private saveUsers(): void {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(this.users));
  }

  registerUser(email: string, password: string): boolean {
    if (this.getUserByEmail(email)) return false;

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      role: 'user',
      vorname: '',
      nachname: '',
      spitzname: '',
      securityQuestion: '',
      securityAnswer: ''
    };
    this.users.push(newUser);
    this.saveUsers();
    return true;
  }

  getUsers(): User[] {
    return [...this.users];
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  getUserRoleByEmail(email: string): 'admin' | 'user' | 'banned' | undefined {
    return this.getUserByEmail(email)?.role;
  }

  updateUserRole(email: string, role: 'admin' | 'user' | 'banned'): void {
    const user = this.getUserByEmail(email);
    if (user) {
      user.role = role;
      this.saveUsers();
    }
  }

  addUser(user: User): void {
    this.users.push(user);
    this.saveUsers();
  }

  deleteUser(email: string): void {
    this.users = this.users.filter(user => user.email !== email);
    this.saveUsers();
  }
}