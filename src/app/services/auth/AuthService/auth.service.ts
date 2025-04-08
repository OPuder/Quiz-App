import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { UserManagementService } from '../../admin/user-management.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private loggedUser?: string;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  private Router = inject(Router);
  private http = inject(HttpClient);
  private userService = inject(UserManagementService);
  private platformId = inject(PLATFORM_ID);

  constructor() {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getFromLocalStorageSafe(key: string): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(key);
  }

  private setToLocalStorageSafe(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  private removeFromLocalStorageSafe(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  private checkApiAvailability(): Observable<boolean> {
    return this.http.get('https://api.escuelajs.co/api/v1/auth/status').pipe(
      catchError(() => of(false)),
      map(() => true) 
    );
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.checkApiAvailability().pipe(
      tap((apiAvailable) => {
        if (apiAvailable) {
          this.loginViaApi(user);
        } else {
          this.loginLocal(user);
        }
      }),
      catchError(() => {
        this.loginLocal(user);
        return of(null);
      })
    );
  }

  loginViaApi(user: { email: string; password: string }): void {
    this.http
      .post('https://api.escuelajs.co/api/v1/auth/login', user)
      .pipe(
        tap((tokens: any) => {
          this.doLoginUser(user.email, JSON.stringify(tokens));
        }),
        catchError((error) => {
          console.error('API Login failed:', error);
          return throwError(() => new Error('API Login failed'));
        })
      )
      .subscribe();
  }

  loginLocal(user: { email: string; password: string }): boolean {
    const foundUser = this.userService.getUserByEmail(user.email);

    if (!foundUser) {
      throw new Error('Benutzer existiert nicht.');
    }

    if (foundUser.password !== user.password) {
      throw new Error('Falsches Passwort.');
    }

    if (foundUser.role === 'banned') {
      alert('Zugang verweigert: Dein Konto ist gesperrt.');
      this.logout();
      return false;
    }

    this.loggedUser = user.email;
    localStorage.setItem(this.JWT_TOKEN, JSON.stringify(foundUser)); // optional
    this.isAuthenticated.next(true);

    return true;
  }

  private doLoginUser(email: string, token: any) {
    this.loggedUser = email;
    this.storeJwtToken(token);
    this.isAuthenticated.next(true);
  }

  private storeJwtToken(jwt: string) {
    this.setToLocalStorageSafe(this.JWT_TOKEN, jwt);
  }

  logout() {
    this.removeFromLocalStorageSafe(this.JWT_TOKEN);
    this.isAuthenticated.next(false);
    this.Router.navigate(['/app-login']);
  }

  getCurrentAuthUser(): Observable<any> {
    return this.http.get('https://api.escuelajs.co/api/v1/auth/profile');
  }

  isLoggedIn(): boolean {
    return !!this.getFromLocalStorageSafe(this.JWT_TOKEN);
  }

  isTokenExpired() {
    const tokens = this.getFromLocalStorageSafe(this.JWT_TOKEN);
    if (!tokens) {
      return true;
    }
    const token = JSON.parse(tokens).access_token;
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) {
      return true;
    }
    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();
    return expirationDate < now;
  }

  refreshToken() {
    const tokens = this.getFromLocalStorageSafe(this.JWT_TOKEN);
    if (!tokens) {
      return;
    }
    const parsed = JSON.parse(tokens);
    const refreshToken = parsed.refresh_token;
    return this.http
      .post<any>('https://api.escuelajs.co/api/v1/auth/refresh-token', {
        refreshToken,
      })
      .pipe(
        tap((tokens: any) =>
          this.storeJwtToken(JSON.stringify(tokens))
        )
      );
  }

  getUserRole(): 'admin' | 'user' | 'banned' {
    const tokens = this.getFromLocalStorageSafe(this.JWT_TOKEN);
    if (!tokens) {
      return 'user';
    }

    const user = JSON.parse(tokens);

    return user.role;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isBanned(): boolean {
    return this.getUserRole() === 'banned';
  }
}