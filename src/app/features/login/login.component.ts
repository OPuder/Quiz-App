import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router);
  authService = inject(AuthService);
  email: string = "";
  password: string = "";

  login(event:Event){
    event.preventDefault();
    this.authService
   .login({
     email: this.email,
     password: this.password
   })
   .subscribe(() => {
    this.router.navigate(['/app-score-board']);
   });
  }
}
