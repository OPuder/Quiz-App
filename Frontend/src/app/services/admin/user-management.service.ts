import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth/AuthService/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = 'http://localhost:5000/api/user';
  private readonly JWT_TOKEN = 'JWT_TOKEN';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  addUser(newUser: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/auth/register', newUser).pipe(
      catchError((error) => {
        console.error('Fehler beim Hinzufügen des Benutzers', error);
        return throwError(
          () => new Error('Fehler beim Hinzufügen des Benutzers')
        );
      })
    );
  }

  updateUserProfile(updatedUser: any): Observable<any> {
    const token = localStorage.getItem(this.JWT_TOKEN);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const url = `${this.apiUrl}/update-profile`;
    return this.http.put(url, updatedUser, { headers });
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

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('JWT_TOKEN');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.role === 'admin';
      }
    }
    return false;
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-AllUsers`);
  }
}
