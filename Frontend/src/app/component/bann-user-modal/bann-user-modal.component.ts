import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UserManagementService } from '../../services/admin/user-management.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-bann-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSlideToggleModule
  ],
  templateUrl: './bann-user-modal.component.html',
  styleUrl: './bann-user-modal.component.css'
})
export class BanUserModalComponent {
  banForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BanUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userService: UserManagementService
  ) {
    this.banForm = this.fb.group({
      isBanned: [this.data.user?.ban?.isBanned || false],
      reason: [''],
      until: [null]
    });
  }

  submitBan(): void {
    const isBanned = this.banForm.value.isBanned;

    const banData = {
      ban: {
        isBanned,
        reason: isBanned ? this.banForm.value.reason : '',
        until: isBanned ? this.banForm.value.until : null
      }
    };

    this.userService.updateUserBan(this.data.user._id, banData).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Fehler beim (Ent)bannen des Benutzers', err);
        alert('Fehler beim Speichern der Bann-Änderung');
      }
    });
  }
}
