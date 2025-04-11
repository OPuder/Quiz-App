import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/AuthService/auth.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class PasswordResetComponent {
  step: number = 1;
  email: string = '';
  securityAnswer: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  emailError: string = '';
  securityError: string = '';
  passwordError: string = '';
  
  securityQuestion: string = 'Was ist der Name deines ersten Haustiers?';  // Beispiel Sicherheitsfrage

  constructor(private router: Router, private authService: AuthService) {}

  // Schritt 1: E-Mail überprüfen
  handleSubmit() {
    switch (this.step) {
      case 1:
        this.checkEmail();
        break;
      case 2:
        this.checkSecurityAnswer();
        break;
      case 3:
        this.resetPassword();
        break;
    }
  }

  // Überprüfe die E-Mail-Adresse
  checkEmail() {
    this.emailError = '';
    this.authService.checkEmailExists(this.email).subscribe({
      next: (response) => {
        if (response.exists) {
          this.step = 2;  // Gehe zu Schritt 2 (Sicherheitsfrage)
        } else {
          this.emailError = 'E-Mail-Adresse nicht gefunden!';
        }
      },
      error: (error) => {
        this.emailError = 'Fehler beim Überprüfen der E-Mail-Adresse';
      },
    });
  }

  // Überprüfe die Sicherheitsantwort
  checkSecurityAnswer() {
    this.securityError = '';
    this.authService.verifySecurityAnswer(this.email, this.securityAnswer).subscribe({
      next: (response) => {
        if (response.valid) {
          this.step = 3;  // Gehe zu Schritt 3 (Passwort zurücksetzen)
        } else {
          this.securityError = 'Falsche Antwort auf die Sicherheitsfrage!';
        }
      },
      error: (error) => {
        this.securityError = 'Fehler bei der Überprüfung der Sicherheitsantwort';
      },
    });
  }

  // Neues Passwort zurücksetzen
  resetPassword() {
    this.passwordError = '';
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Die Passwörter stimmen nicht überein!';
      return;
    }

    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: (response) => {
        const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]); // Nach erfolgreichem Reset zur Login-Seite weiterleiten
      },
      error: (error) => {
        this.passwordError = 'Fehler beim Zurücksetzen des Passworts';
      },
    });
  }
}