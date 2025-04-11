import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private loggedUser: string | undefined;

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router
  ) {}

  // Registrierung eines neuen Benutzers
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
      tap((tokens: any) => {
        if (tokens?.access_token) {
          this.storeJwtToken(tokens);
          this.storeRefreshToken(tokens.refresh_token);
          this.isAuthenticated.next(true); // Benutzer wird eingeloggt
        }
      }),
      catchError((error) => {
        console.error('Fehler bei der Registrierung:', error);
        this.snackBar.open('Registrierung fehlgeschlagen', 'Schließen', {
          duration: 3000,
        });
        return throwError(() => new Error('Registrierung fehlgeschlagen.'));
      })
    );
  }
  
  // Login
  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:5000/api/login', user).pipe(
      tap((tokens: any) => {
        if (tokens?.access_token) {
          this.storeJwtToken(tokens);
          this.storeRefreshToken(tokens.refresh_token);
          this.isAuthenticated.next(true);
          this.loggedUser = user.email;
  
          const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        }
      }),
      catchError((error) => {
        console.error('Fehler beim Login:', error);
        this.snackBar.open('Login fehlgeschlagen', 'Schließen', { duration: 3000 });
        return throwError(() => new Error('Login fehlgeschlagen.'));
      })
    );
  }

  // Token speichern
  public storeJwtToken(jwt: any): void {
    localStorage.setItem(this.JWT_TOKEN, JSON.stringify(jwt));
  }

  // Refresh Token speichern
  public storeRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  // Überprüfen, ob der Benutzer eingeloggt ist
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.JWT_TOKEN);
    return token !== null && !this.isTokenExpired();
  }

  // Token abgelaufen?
  private isTokenExpired(): boolean {
    const token = localStorage.getItem(this.JWT_TOKEN);
    if (!token) return true;

    const decoded: any = jwtDecode(token);
    const expirationDate = decoded.exp * 1000;
    return expirationDate < Date.now();
  }

    private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private removeFromLocalStorageSafe(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  // Logout des Benutzers
  logout() {
    // Entferne das Access-Token und den Refresh-Token aus dem localStorage
    this.removeFromLocalStorageSafe(this.JWT_TOKEN);
    this.removeFromLocalStorageSafe(this.REFRESH_TOKEN);

    // Setze den Authentifizierungsstatus auf false zurück
    this.isAuthenticated.next(false);

    // Optional: Setze die Benutzerrolle und andere Daten zurück
    this.loggedUser = undefined; // Optional: Setze die gespeicherte E-Mail zurück

    // Leite den Benutzer zur Login-Seite weiter
    this.router.navigate(['/app-login'])
      .then(() => {
      })
      .catch((error) => {
        console.error('Fehler bei der Weiterleitung:', error);
      });
  }
}