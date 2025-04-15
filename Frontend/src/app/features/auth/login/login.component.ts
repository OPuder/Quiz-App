import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth/AuthService/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  router = inject(Router);
  authService = inject(AuthService);
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  login(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.authService
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          const banned = response.banned;
          if (banned?.isBanned) {
            const now = new Date();
            const until = banned.until ? new Date(banned.until) : null;
    
            if (!until || now < until) {
              const banInfo = banned.reason 
                ? `Grund: ${banned.reason}` 
                : 'Du bist derzeit gebannt.';
              const untilInfo = until 
                ? `Bis: ${until.toLocaleString('de-DE')}` 
                : '(permanent)';
              this.errorMessage = `Login gesperrt. ${banInfo} ${untilInfo}`;
              return;
            }
          }

          const userRole = response.role;
          if (userRole === 'admin') {
            this.router.navigate(['/app-admin']);
          } else {
            this.router.navigate(['/app-score-board']);
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login fehlgeschlagen.';
          this.snackBar.open(this.errorMessage, 'OK', {
            duration: 3000,
          });
        }
      });
  }

  goToRegister(): void {
    this.router.navigate(['/app-register']);
  }
}
