import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth/AuthService/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = 'http://localhost:5000/api';
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  
  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  // Benutzerprofil abrufen
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  // Benutzerprofil aktualisieren
  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, userData);
  }

  // Passwort ändern
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { oldPassword, newPassword });
  }

  // Methode zur Überprüfung, ob der Benutzer ein Admin ist
  isAdmin(): boolean {
    const token = localStorage.getItem(this.JWT_TOKEN);

    if (!token) {
      return false; // Kein Token vorhanden, daher kein Admin
    }

    try {
      const decodedToken: any = jwtDecode(token); // Token dekodieren
      return decodedToken.role === 'admin'; // Rolle prüfen
    } catch (error) {
      console.error('Fehler beim Dekodieren des Tokens:', error);
      return false; // Wenn das Dekodieren fehlschlägt, gehe davon aus, dass der Benutzer kein Admin ist
    }
  }
}
