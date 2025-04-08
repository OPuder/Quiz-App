import { Component } from '@angular/core';
import { UserManagementService } from '../../../services/admin/user-management.service';
import { AuthService } from '../../../services/auth/AuthService/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string = '';
  securityAnswer: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserManagementService, private authService: AuthService) {}

  resetPassword(event: Event) {
    event.preventDefault();

    // Versuchen, den Benutzer aus localStorage zu laden
    const foundUser = this.userService.getUserByEmail(this.email);

    if (!foundUser) {
      this.errorMessage = 'Benutzer existiert nicht.';
      this.successMessage = '';
      return;
    }

    // Überprüfe, ob die Sicherheitsantwort korrekt ist
    if (foundUser.securityAnswer !== this.securityAnswer) {
      this.errorMessage = 'Sicherheitsantwort ist falsch.';
      this.successMessage = '';
      return;
    }

    // Setze das neue Passwort und speichere es im localStorage
    foundUser.password = this.newPassword;
    localStorage.setItem(this.email, JSON.stringify(foundUser));

    this.successMessage = 'Passwort erfolgreich zurückgesetzt!';
    this.errorMessage = '';
  }
}
