import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { UserUpdatePayload } from '../../shared/models/user.model';
import { UserManagementService } from '../../services/admin/user-management.service';

@Component({
    selector: 'app-edit-user-modal',
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
        MatDividerModule,
    ],
    templateUrl: './edit-user-modal.component.html',
    styleUrl: './edit-user-modal.component.css'
})
export class EditUserModalComponent {
  editUserForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserUpdatePayload,
    private fb: FormBuilder,
    private userManagementService: UserManagementService,
    private snackBar: MatSnackBar
  ) {
    this.editUserForm = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      spitzname: ['', Validators.required],
      email: ['', Validators.required],
      role: ['user', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['', [Validators.minLength(6)]],
    });

    this.editUserForm.patchValue({
      vorname: this.data.vorname,
      nachname: this.data.nachname,
      spitzname: this.data.spitzname,
      email: this.data.email,
      role: this.data.role,
      securityQuestion: this.data.securityQuestion,
      securityAnswer: this.data.securityAnswer,
    });
  }

  submit() {
    if (this.editUserForm.invalid) return;

    const formValue = this.editUserForm.value;

    if (formValue.password || formValue.confirmPassword) {
      if (formValue.password !== formValue.confirmPassword) {
        this.snackBar.open('Die Passwörter stimmen nicht überein', 'Schließen', {
          duration: 3000,
        });
        return;
      }
    }

    const updatedUser: any = {
      vorname: formValue.vorname,
      nachname: formValue.nachname,
      spitzname: formValue.spitzname,
      role: formValue.role,
      securityQuestion: formValue.securityQuestion,
      securityAnswer: formValue.securityAnswer,
    };

    if (formValue.email && formValue.email.trim() !== '') {
      updatedUser.email = formValue.email;
    }

    if (formValue.password) {
      updatedUser.password = formValue.password;
      updatedUser.confirmPassword = formValue.confirmPassword;
    }

    const userId = this.data._id;

    this.userManagementService.updateUserProfile(userId, updatedUser).subscribe({
      next: (response) => {
        console.log('Benutzer aktualisiert:', response);
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Fehler beim Aktualisieren des Benutzers:', err);
        this.snackBar.open('Fehler beim Speichern', 'Schließen', {
          duration: 3000,
        });
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
