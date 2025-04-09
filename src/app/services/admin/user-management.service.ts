import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly USER_API_URL = 'http://localhost:5000/api/users';  // API-URL anpassen
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  constructor() {}

  // Benutzer registrieren
  registerUser(email: string, password: string): Observable<boolean> {
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

    return this.http.post<boolean>(`${this.USER_API_URL}/register`, newUser).pipe(
      catchError((error) => {
        console.error('Fehler bei der Registrierung:', error);
        return of(false); // Fehlerbehandlung
      })
    );
  }

  // Alle Benutzer abrufen
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.USER_API_URL).pipe(
      catchError((error) => {
        console.error('Fehler beim Abrufen der Benutzer:', error);
        return of([]); // Fehlerbehandlung
      })
    );
  }

  // Benutzer nach E-Mail suchen
  getUserByEmail(email: string): Observable<User | undefined> {
    return this.http.get<User[]>(`${this.USER_API_URL}?email=${email}`).pipe(
      catchError((error) => {
        console.error('Fehler bei der Benutzersuche:', error);
        return of([]); // Leeres Array zurückgeben, anstatt undefined
      }),
      map((users: User[]) => users?.[0]) // Optional Chaining für das sichere Zugreifen
    );
  }  

  // Benutzerrolle basierend auf E-Mail abrufen
  getUserRoleByEmail(email: string): Observable<'admin' | 'user' | 'banned' | undefined> {
    return this.getUserByEmail(email).pipe(
      map(user => user?.role)
    );
  }

  // Benutzerrolle aktualisieren
  updateUserRole(email: string, role: 'admin' | 'user' | 'banned'): Observable<void> {
    return this.http.put<void>(`${this.USER_API_URL}/update-role`, { email, role }).pipe(
      catchError((error) => {
        console.error('Fehler beim Aktualisieren der Benutzerrolle:', error);
        return of(undefined); // Fehlerbehandlung
      })
    );
  }

  // Benutzer löschen
  deleteUser(email: string): Observable<void> {
    return this.http.delete<void>(`${this.USER_API_URL}/delete?email=${email}`).pipe(
      catchError((error) => {
        console.error('Fehler beim Löschen des Benutzers:', error);
        return of(undefined); // Fehlerbehandlung
      })
    );
  }
}
