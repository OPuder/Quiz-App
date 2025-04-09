import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

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
  firstName: string = '';
  lastName: string = '';
  securityAnswer: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  emailError: string = '';
  nameError: string = '';
  securityError: string = '';
  passwordError: string = '';

  securityQuestion: string = 'Was ist der Name deines ersten Haustiers?';  // Beispiel Sicherheitsfrage

  constructor(private router: Router) {}

  checkEmail() {
    this.emailError = '';
    // Überprüfe, ob die E-Mail im localStorage existiert
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user && user.email === this.email) {
      this.step = 2;  // Gehe zum nächsten Schritt
    } else {
      this.emailError = 'E-Mail-Adresse nicht gefunden!';
    }
  }

  checkName() {
    this.nameError = '';
    // Überprüfe Vorname und Nachname im localStorage
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user && user.firstName === this.firstName && user.lastName === this.lastName) {
      this.step = 3;  // Gehe zum nächsten Schritt
    } else {
      this.nameError = 'Vorname oder Nachname stimmen nicht überein!';
    }
  }

  checkSecurityAnswer() {
    this.securityError = '';
    // Überprüfe die Antwort der Sicherheitsfrage im localStorage
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user && user.securityAnswer === this.securityAnswer) {
      this.step = 4;  // Gehe zum nächsten Schritt
    } else {
      this.securityError = 'Falsche Antwort!';
    }
  }

  resetPassword() {
    this.passwordError = '';
    // Überprüfe, ob die Passwörter übereinstimmen
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Die Passwörter stimmen nicht überein!';
      return;
    }

    // Setze das neue Passwort im localStorage
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      user.password = this.newPassword;  // Passwort im user-Objekt aktualisieren
      localStorage.setItem('user', JSON.stringify(user));  // Speichere die Änderungen im localStorage
      this.router.navigate(['/login']);  // Weiterleitung zur Login-Seite nach erfolgreichem Zurücksetzen
    }
  }
}