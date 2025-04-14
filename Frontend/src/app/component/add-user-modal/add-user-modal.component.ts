import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth/AuthService/auth.service';
import { NewUser, User } from '../../shared/models/user.model';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css'
})
export class AddUserModalComponent {
  defultUser: NewUser = {
    vorname: '',
    nachname: '',
    spitzname: '',
    email: '',
    password: '',
    role: 'admin',
    securityQuestion: '',
    securityAnswer: ''
  };

  newUser: any = {
    ...this.defultUser,
    comfirmPassword: '',
  }

  constructor(
    public dialogRef: MatDialogRef<AddUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService
  ) {}

  submitForm() {
    if (this.newUser.password !== this.newUser.confirmPassword) {
      console.error('Die Passwörter stimmen nicht überein.');
      return;
    }
  
    if (!this.newUser.vorname || !this.newUser.nachname || !this.newUser.email) {
      console.error('Es fehlen erforderliche Felder.');
      return;
    }
  
    console.log('Benutzer wird registriert:', this.newUser);
  
    this.authService.register(this.newUser).subscribe({
      next: (response) => {
        console.log('Benutzer erfolgreich registriert', response);
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Fehler bei der Registrierung:', err);
      }
    });
  }
  
  cancel(): void {
    this.dialogRef.close();
  }
}