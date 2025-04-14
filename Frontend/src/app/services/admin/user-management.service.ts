import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth/AuthService/auth.service';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'User' | 'Ban';
}

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = 'http://localhost:5000/api/user';
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromToken();
  }

  addUser(newUser: any): Observable<any> {
    const { confirmPassword, ...userData } = newUser;

    return this.http.post('http://localhost:5000/api/auth/register', userData).pipe(
      catchError((error) => {
        console.error('Fehler beim Hinzufügen des Benutzers', error);
        return throwError(
          () => new Error('Fehler beim Hinzufügen des Benutzers')
        );
      })
    );
  }

  updateUserProfile(userId: string, updatedData: any): Observable<any> {
    const token = localStorage.getItem('JWT_TOKEN');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}/user/${userId}`;
  
    return this.http.put(url, updatedData, { headers });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/user/${id}`).pipe(
      catchError((error) => {
        console.error('Fehler beim Löschen des Benutzers', error);
        return throwError(() => new Error('Fehler beim Löschen des Benutzers'));
      })
    );
  }

  updateUserRole(id: string, role: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/${id}/role`, { role }).pipe(
      catchError((error) => {
        console.error('Fehler beim Ändern der Benutzerrolle', error);
        return throwError(
          () => new Error('Fehler beim Ändern der Benutzerrolle')
        );
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/change-password`, { oldPassword, newPassword })
      .pipe(
        catchError((error) => {
          console.error('Fehler beim Ändern des Passworts', error);
          return throwError(
            () => new Error('Fehler beim Ändern des Passworts')
          );
        })
      );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-AllUsers`);
  }

  getCurrentUser(): any | null {
    return this.currentUserSubject.value;
  }

  isAdmin$ = this.currentUser$.pipe(
    map(user => user?.role === 'Admin')
  );

  loadUserFromToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.JWT_TOKEN);
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          const user: User = {
            id: decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
          };
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Fehler beim Dekodieren des Tokens', error);
        }
      }
    }
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }
}
