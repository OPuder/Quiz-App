import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN'; // Token für den Refresh
  private loggedUser?: string;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  private Router = inject(Router);
  private http = inject(HttpClient);
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
    return this.http.get('http://localhost:5000/api/status').pipe(
      catchError(() => of(false)),
      map(() => true)
    );
  }

  // Login-Methode
  login(user: { email: string; password: string }): Observable<any> {
    return this.loginViaApi(user).pipe(
      tap((tokens) => {
        if (tokens) {
          this.doLoginUser(user.email, tokens);
        }
      }),
      catchError((error) => {
        console.error('Login fehlgeschlagen:', error);
        return of(null);
      })
    );
  }

  // API-Aufruf für den Login
  loginViaApi(user: { email: string; password: string }): Observable<any> {
    return this.http
      .post('http://localhost:5000/api/login', user)  // Stellen Sie sicher, dass dies mit dem richtigen Backend-Endpoint übereinstimmt
      .pipe(
        tap((tokens: any) => {
          if (tokens?.access_token) {
            this.storeJwtToken(tokens);
            this.storeRefreshToken(tokens.refresh_token);  // Refresh-Token speichern
          }
        }),
        catchError((error) => {
          console.error('Fehler beim Login über API:', error);
          return throwError(() => new Error('Login über API fehlgeschlagen.'));
        })
      );
  }
  
  // Nach erfolgreichem Login wird der Benutzer eingeloggt
  private doLoginUser(email: string, tokens: any) {
    this.loggedUser = email;
    this.isAuthenticated.next(true);
  }

  // Speichern des JWT-Access-Tokens
  private storeJwtToken(jwt: any) {
    this.setToLocalStorageSafe(this.JWT_TOKEN, JSON.stringify(jwt));
  }

  // Speichern des Refresh-Tokens
  private storeRefreshToken(refreshToken: string) {
    this.setToLocalStorageSafe(this.REFRESH_TOKEN, refreshToken);
  }

  // Logout des Benutzers
  logout() {
    this.removeFromLocalStorageSafe(this.JWT_TOKEN);
    this.removeFromLocalStorageSafe(this.REFRESH_TOKEN);
    this.isAuthenticated.next(false);
    this.Router.navigate(['/login']); // Navigiere zu Login-Seite nach Logout
  }

  // Hole das Profil des aktuellen Benutzers
  getCurrentAuthUser(): Observable<any> {
    return this.http.get('http://localhost:5000/api/profile'); // API-Endpunkt für Benutzerprofil
  }

  // Überprüfen, ob der Benutzer eingeloggt ist
  isLoggedIn(): boolean {
    return !!this.getFromLocalStorageSafe(this.JWT_TOKEN);
  }

  // Überprüfen, ob das Token abgelaufen ist
  isTokenExpired(): boolean {
    const tokens = this.getFromLocalStorageSafe(this.JWT_TOKEN);
    if (!tokens) {
      return true;
    }
    const token = JSON.parse(tokens).access_token;
    const decoded: any = jwtDecode(token);
    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();
    return expirationDate < now;
  }

  // Token mit dem Refresh-Token erneuern
  refreshToken(): Observable<any> {
    const refreshToken = this.getFromLocalStorageSafe(this.REFRESH_TOKEN);
    if (!refreshToken) {
      return throwError(() => new Error('Kein Refresh-Token vorhanden.'));
    }

    return this.http
      .post<any>('http://localhost:5000/api/refresh-token', { refreshToken })
      .pipe(
        tap((tokens: any) => {
          this.storeJwtToken(tokens.access_token); // Neuer Access-Token speichern
          this.storeRefreshToken(tokens.refresh_token); // Neuer Refresh-Token speichern
        }),
        catchError((error) => {
          console.error('Fehler beim Erneuern des Tokens:', error);
          return throwError(() => new Error('Token-Erneuerung fehlgeschlagen.'));
        })
      );
  }

  // Holt die Rolle des Benutzers aus dem gespeicherten Token
  getUserRole(): 'admin' | 'user' | 'banned' {
    const tokens = this.getFromLocalStorageSafe(this.JWT_TOKEN);
    if (!tokens) {
      return 'user';
    }

    const user = JSON.parse(tokens);
    return user.role || 'user';
  }

  // Prüft, ob der Benutzer Admin ist
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  // Prüft, ob der Benutzer gesperrt ist
  isBanned(): boolean {
    return this.getUserRole() === 'banned';
  }
}
