import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserManagementService } from '../../../services/admin/user-management.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private router = inject(Router);
  private userService = inject(UserManagementService);

  email: string = '';
  password: string = '';
  message: string = '';

  register(event: Event) {
    event.preventDefault();
    const success = this.userService.registerUser(this.email, this.password);
    if (success) {
      this.message = 'Registrierung erfolgreich. Du wirst weitergeleitet.';
      setTimeout(() => this.router.navigate(['/app-login']), 1500);
    } else {
      this.message = 'E-Mail existiert bereits.';
    }
  }
}
