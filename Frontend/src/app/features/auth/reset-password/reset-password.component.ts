import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/AuthService/auth.service';

@Component({
    selector: 'app-password-reset',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})

export class PasswordResetComponent {
  step: number = 1;
  email: string = '';
  securityQuestion: string = '';
  securityAnswer: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  emailError: string = '';
  securityError: string = '';
  passwordError: string = '';
  

  constructor(private router: Router, private authService: AuthService) {}

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

  checkEmail() {
    this.emailError = '';
    this.authService.checkEmailExists(this.email).subscribe({
      next: (response) => {
        if (response.message === 'E-Mail existiert') {
          this.loadSecurityQuestion();
        } else {
          this.emailError = 'E-Mail-Adresse nicht gefunden!';
        }
      },
      error: (error) => {
        this.emailError = 'Fehler beim Überprüfen der E-Mail-Adresse';
      },
    });
  }

  loadSecurityQuestion() {
    this.securityError = '';
    this.authService.getSecurityQuestion(this.email).subscribe({
      next: (response) => {
        this.securityQuestion = response.question;
        this.step = 2;
      },
      error: (error) => {
        this.securityError = 'Fehler beim Abrufen der Sicherheitsfrage';
      },
    });
  }

  checkSecurityAnswer() {
    this.securityError = '';
    this.authService.verifySecurityAnswer(this.email, this.securityAnswer).subscribe({
      next: (response) => {
        if (response.valid) {
          this.step = 3;
        } else {
          this.securityError = 'Falsche Antwort auf die Sicherheitsfrage!';
        }
      },
      error: (error) => {
        this.securityError = 'Fehler bei der Überprüfung der Sicherheitsantwort';
      },
    });
  }

  resetPassword() {
    this.passwordError = '';
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Die Passwörter stimmen nicht überein!';
      return;
    }

    this.authService.resetPassword(this.email, this.securityAnswer, this.newPassword).subscribe({
      next: (response) => {
        this.router.navigate(['/app-login']);
      },
      error: (error) => {
        this.passwordError = 'Fehler beim Zurücksetzen des Passworts';
      },
    });
  }
}