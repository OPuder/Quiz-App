import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/AuthService/auth.service';
import { UserManagementService } from '../../../services/admin/user-management.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  vorname: string = '';
  nachname: string = '';
  spitzname: string = '';
  securityQuestion: string = '';
  securityAnswer: string = '';
  role: 'user' | 'admin' = 'user';
  errorMessage: string = '';

  constructor(

    private router: Router,
    private authService: AuthService
  ) {}

  // Registrierungsmethode
  onRegister(event: Event): void {
    event.preventDefault();

    // Überprüfen, ob die Passwörter übereinstimmen
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Die Passwörter stimmen nicht überein.';
      return;
    }

    // Validierung der Felder
    if (
      !this.vorname ||
      !this.nachname ||
      !this.spitzname ||
      !this.email ||
      !this.password ||
      !this.securityQuestion ||
      !this.securityAnswer
    ) {
      this.errorMessage = 'Bitte füllen Sie alle Felder aus.';
      return;
    }

    // Registrierung des Benutzers über den AuthService
    this.authService
      .register({
        vorname: this.vorname,
        nachname: this.nachname,
        spitzname: this.spitzname,
        email: this.email,
        password: this.password,
        role: this.role,
        securityQuestion: this.securityQuestion,
        securityAnswer: this.securityAnswer,
      })
    .subscribe({
      next: (response) => {
        // Direkt nach der Registrierung einloggen
        if (response.token) {
          this.authService.storeJwtToken(response.token);
          this.authService.storeRefreshToken(response.refresh_token);
          this.router.navigate(['/app-score-board']);  // Nach dem Login zur gewünschten Seite weiterleiten
        }
      },
      error: (err) => {
        console.error('Fehler bei der Registrierung:', err);
        this.errorMessage =
          err.error?.message || 'Fehler bei der Registrierung, bitte versuche es später noch einmal.';
      },
    });
  }
}
