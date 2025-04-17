import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

  failedLoginCount: number = 0;
  loginDisabled: boolean = false;
  cooldownSeconds: number = 0;
  private countdownInterval: any;
  private cooldownTimer: any;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const count = parseInt(localStorage.getItem('failedLoginCount') || '0');
      const last = parseInt(localStorage.getItem('lastFailedLogin') || '0');
      const elapsed = (Date.now() - last) / 1000;
  
      const cooldown = count * 30;
      if (elapsed < cooldown) {
        this.disableLoginTemporarily(cooldown - elapsed);
      }
    }
  }

  ngOnDestroy() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }
  }

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
          localStorage.removeItem('failedLoginCount');
          localStorage.removeItem('lastFailedLogin');

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
        
          let cooldownSeconds = 0;
        
          if (isPlatformBrowser(this.platformId)) {
            let count = parseInt(localStorage.getItem('failedLoginCount') || '0');
            count++;
            localStorage.setItem('failedLoginCount', count.toString());
            localStorage.setItem('lastFailedLogin', Date.now().toString());
        
            cooldownSeconds = count * 30;
          }
        
          this.disableLoginTemporarily(cooldownSeconds);
        }
      });
  }

  disableLoginTemporarily(seconds: number) {
    this.loginDisabled = true;
    this.cooldownSeconds = Math.ceil(seconds);

    clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      this.cooldownSeconds--;
      if (this.cooldownSeconds <= 0) {
        this.loginDisabled = false;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  goToRegister(): void {
    this.router.navigate(['/app-register']);
  }
}
