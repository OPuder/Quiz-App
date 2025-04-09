import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserManagementService } from '../../../services/admin/user-management.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  vorname: string = '';
  nachname: string = '';
  spitzname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  securityQuestion: string = '';
  securityAnswer: string = '';
  errorMessage: string = '';

  private userManagementService = inject(UserManagementService);

  constructor(private router: Router) {}

  // Registrierungsmethode
  register(event: Event): void {
    event.preventDefault();

    // Überprüfen, ob die Passwörter übereinstimmen
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Die Passwörter stimmen nicht überein.';
      return;
    }

    // Validierung der Felder
    if (!this.vorname || !this.nachname || !this.spitzname || !this.email || !this.password || !this.securityQuestion || !this.securityAnswer) {
      this.errorMessage = 'Bitte füllen Sie alle Felder aus.';
      return;
    }

    if (!this.userManagementService.registerUser(this.email, this.password)) {
      this.errorMessage = 'Benutzer mit dieser E-Mail-Adresse existiert bereits.';
      return;
    }
    // Weiterleitung zur Login-Seite nach erfolgreicher Registrierung
    this.router.navigate(['/app-login']);
  }
}
