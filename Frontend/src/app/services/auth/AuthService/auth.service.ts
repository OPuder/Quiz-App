import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserManagementService } from '../../admin/user-management.service';
import { NewUser } from '../../../shared/models/user.model';

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
    private userManagementService: UserManagementService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router
  ) {}

  register(user: NewUser): Observable<any> {
    return this.http.post('http://localhost:5000/api/auth/register', user).pipe(
      tap((tokens: any) => {
        if (tokens?.access_token) {
          this.storeJwtToken(tokens);
          this.storeRefreshToken(tokens.refresh_token);
          this.isAuthenticated.next(true);
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

  createUserByAdmin(user: NewUser): Observable<any> {
    return this.http.post('http://localhost:5000/api/auth/create', user);
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:5000/api/auth/login', user).pipe(
      tap((tokens: any) => {
        if (tokens?.token) {
          this.storeJwtToken(tokens);
          this.storeRefreshToken(tokens.refresh_token);
          this.isAuthenticated.next(true);
          this.loggedUser = user.email;

          const decodedToken: any = jwtDecode(tokens.token);
          this.userManagementService.setCurrentUser({
            id: decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
          });

          const returnUrl =
            this.router.routerState.snapshot.root.queryParams['returnUrl'] ||
            '/';
          this.router.navigate([returnUrl]);
        }
      }),
      catchError((error) => {
        console.error('Fehler beim Login:', error);
        this.snackBar.open('Login fehlgeschlagen', 'Schließen', {
          duration: 3000,
        });
        return throwError(() => new Error('Login fehlgeschlagen.'));
      })
    );
  }

  public storeJwtToken(jwt: any): void {
    localStorage.setItem(this.JWT_TOKEN, JSON.stringify(jwt));
  }

  public storeRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('JWT_TOKEN');
      return token !== null && !this.isTokenExpired();
    }
    return false;
  }

  isAdminLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('JWT_TOKEN');
      if (token && !this.isTokenExpired()) {
        const decodedToken: any = jwtDecode(token);
        const role = decodedToken.role;
        return role && role.toLowerCase() === 'admin';
      }
    }
    return false;
  }

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

  checkEmailExists(email: string): Observable<any> {
    return this.http
      .post<any>('http://localhost:5000/api/user/check-email', { email })
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            console.error('Fehler: E-Mail existiert nicht.');
            alert(
              'Diese E-Mail existiert nicht. Bitte versuchen Sie es mit einer anderen E-Mail.'
            );
          } else if (error.status === 400) {
            console.error('Fehler: Die E-Mail existiert bereits.');
          } else {
            console.error('Fehler bei der Überprüfung der E-Mail:', error);
            alert(
              'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.'
            );
          }
          return throwError(
            () => new Error('Fehler bei der Überprüfung der E-Mail')
          );
        })
      );
  }

  getSecurityQuestion(email: string): Observable<any> {
    return this.http
      .get<any>(
        `http://localhost:5000/api/user/get-security-question?email=${email}`
      )
      .pipe(
        catchError((error) => {
          console.error('Fehler beim Abrufen der Sicherheitsfrage:', error);
          return throwError(
            () => new Error('Fehler beim Abrufen der Sicherheitsfrage')
          );
        })
      );
  }

  verifySecurityAnswer(email: string, securityAnswer: string): Observable<any> {
    return this.http
      .post<any>(`http://localhost:5000/api/user/verify-security-answer`, {
        email,
        securityAnswer,
      })
      .pipe(
        catchError((error) => {
          console.error(
            'Fehler bei der Überprüfung der Sicherheitsantwort:',
            error
          );
          return throwError(
            () => new Error('Fehler bei der Überprüfung der Sicherheitsantwort')
          );
        })
      );
  }

  resetPassword(email: string, securityAnswer: string, newPassword: string): Observable<any> {
    return this.http
      .post<any>('http://localhost:5000/api/user/reset-password', {
        email,
        securityAnswer,
        newPassword,
      })
      .pipe(
        catchError((error) => {
          console.error('Fehler beim Zurücksetzen des Passworts:', error);
          return throwError(
            () => new Error('Fehler beim Zurücksetzen des Passworts')
          );
        })
      );
  }

  logout() {
    this.removeFromLocalStorageSafe(this.JWT_TOKEN);
    this.removeFromLocalStorageSafe(this.REFRESH_TOKEN);

    this.isAuthenticated.next(false);

    this.loggedUser = undefined;

    this.router
      .navigate(['/app-login'])
      .then(() => {})
      .catch((error) => {
        console.error('Fehler bei der Weiterleitung:', error);
      });
  }
}
