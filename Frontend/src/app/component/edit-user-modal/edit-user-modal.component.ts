import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth/AuthService/auth.service';
import { User } from '../../shared/models/user.model';
import { UserManagementService } from '../../services/admin/user-management.service';

@Component({
  selector: 'app-edit-user-modal',
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
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.css'
})

export class EditUserModalComponent {
  editUserForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fb: FormBuilder,
    private userManagementService: UserManagementService
  ) {
    this.editUserForm = this.fb.group({
      vorname: [data.vorname, Validators.required],
      nachname: [data.nachname, Validators.required],
      spitzname: [data.spitzname, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      role: [data.role, Validators.required],
      securityQuestion: [data.securityQuestion, Validators.required],
      securityAnswer: [data.securityAnswer, Validators.required]
    });
  }

  submit() {
    if (this.editUserForm.invalid) return;

    const updatedUser = {
      ...this.editUserForm.value,
    };

    const userId = this.data.id || this.data._id;

    this.userManagementService.updateUserProfile(userId, updatedUser).subscribe({
      next: (response) => {
        console.log('Benutzer aktualisiert:', response);
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Fehler beim Aktualisieren des Benutzers:', err);
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}