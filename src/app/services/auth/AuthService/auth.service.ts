import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN'; // Token für den Refresh
  private loggedUser?: string;
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public userRole: 'admin' | 'user' | 'banned' = 'user';

  private Router = inject(Router);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  constructor(private snackBar: MatSnackBar) {}

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

  // API-Aufruf für den Login
  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:5000/api/login', user).pipe(
      tap((tokens: any) => {
        if (tokens?.access_token) {
          this.storeJwtToken(tokens);
          this.storeRefreshToken(tokens.refresh_token);
          this.doLoginUser(user.email, tokens);
        }
      }),
      catchError((error) => {
        console.error('Fehler beim Login über API:', error);
        this.snackBar.open(
          'Login fehlgeschlagen. Bitte versuchen Sie es erneut.',
          'Schließen',
          { duration: 3000 }
        );
        return throwError(() => new Error('Login über API fehlgeschlagen.'));
      })
    );
  }

  // API-Aufruf zur Registrierung
  register(user: { 
    vorname: string;
    nachname: string;
    spitzname: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'banned';
    securityQuestion: string;
    securityAnswer: string;
  }): Observable<any> {
    return this.http.post('http://localhost:5000/api/register', user).pipe(
      tap((response) => {
        console.log('Benutzer erfolgreich registriert:', response);
        // Erfolgreiche Registrierung: Weiterleitung zur Login-Seite
        this.Router.navigate(['/app-login']);
      }),
      catchError((error) => {
        console.error('Fehler bei der Registrierung:', error);
        return throwError(() => new Error('Registrierung fehlgeschlagen.'));
      })
    );
  }
  
  // Nach erfolgreichem Login wird der Benutzer eingeloggt
  private doLoginUser(email: string, tokens: any) {
    this.loggedUser = email;
    this.isAuthenticated.next(true);

    // Extrahiere die Rolle direkt beim Login
    const role = this.getUserRole();
    console.log('Benutzer-Rolle:', role);

    this.userRole = role;
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
    // Entferne das Access-Token und den Refresh-Token aus dem localStorage
    this.removeFromLocalStorageSafe(this.JWT_TOKEN);
    this.removeFromLocalStorageSafe(this.REFRESH_TOKEN);

    // Setze den Authentifizierungsstatus auf false zurück
    this.isAuthenticated.next(false);

    // Optional: Setze die Benutzerrolle und andere Daten zurück
    this.userRole = 'user'; // Setze die Rolle zurück
    this.loggedUser = undefined; // Optional: Setze die gespeicherte E-Mail zurück

    // Leite den Benutzer zur Login-Seite weiter
    this.Router.navigate(['/app-login'])
      .then(() => {
        console.log('Erfolgreich zur Login-Seite weitergeleitet');
      })
      .catch((error) => {
        console.error('Fehler bei der Weiterleitung:', error);
      });
  }

  // Hole das Profil des aktuellen Benutzers
  getCurrentAuthUser(): Observable<any> {
    return this.http.get('http://localhost:5000/api/profile'); // API-Endpunkt für Benutzerprofil
  }

  // Überprüfen, ob der Benutzer eingeloggt ist
  isLoggedIn(): boolean {
    const token = this.getFromLocalStorageSafe(this.JWT_TOKEN);
    const refreshToken = this.getFromLocalStorageSafe(this.REFRESH_TOKEN);

    if (token && refreshToken && !this.isTokenExpired()) {
      return true;
    }

    return false;
  }

  // Überprüfen, ob das Token abgelaufen ist
  isTokenExpired(): boolean {
    const token = this.getFromLocalStorageSafe(this.JWT_TOKEN);

    if (!token) return true; // Kein Token vorhanden, also abgelaufen

    const decoded: any = jwtDecode(token);
    const expirationDate = decoded.exp * 1000; // Umwandlung in Millisekunden
    const now = new Date().getTime();

    return expirationDate < now; // Rückgabe true, wenn das Token abgelaufen ist
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
          return throwError(
            () => new Error('Token-Erneuerung fehlgeschlagen.')
          );
        })
      );
  }

  // Holt die Rolle des Benutzers aus dem gespeicherten Token
  getUserRole(): 'admin' | 'user' | 'banned' {
    const tokens = this.getFromLocalStorageSafe(this.JWT_TOKEN);
    if (!tokens) {
      return 'user';
    }

    try {
      // Dekodiere das JWT und extrahiere die Rolle
      const decodedToken: any = jwtDecode(tokens);
      return decodedToken.role || 'user';
    } catch (error) {
      console.error('Fehler beim Dekodieren des Tokens:', error);
      return 'user';
    }
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
