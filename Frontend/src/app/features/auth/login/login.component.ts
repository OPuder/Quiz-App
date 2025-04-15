import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {} from '@angular/common/http';
import { AuthService } from '../../../services/auth/AuthService/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, 
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  router = inject(Router);
  authService = inject(AuthService);
  email: string = "";
  password: string = "";
  errorMessage: string = "";

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
          const userRole = response.role;
          if (userRole === 'admin') {
            this.router.navigate(['/app-admin']);
          } else {
            this.router.navigate(['/app-score-board']);
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'Login fehlgeschlagen.';
        },
      });
  }

  goToRegister(): void {
    this.router.navigate(['/app-register']);
  }
}
