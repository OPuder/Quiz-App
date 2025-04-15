import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { UserManagementService } from '../../services/admin/user-management.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
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
    MatSlideToggleModule,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }
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
      isBanned: [this.data.user?.banned?.isBanned || false],
      reason: [this.data.user?.banned?.reason || ''],
      untilDate: [this.data.user?.banned?.until ? new Date(this.data.user.banned.until) : null],
      untilHour: [0],
      untilMinute: [0]
    });
  }

  submitBan(): void {
    const formValue = this.banForm.value;
    
    console.log('formValue', formValue);
    
    let until: Date | null = null;
    if (formValue.isBanned && formValue.untilDate) {
      until = new Date(formValue.untilDate);
      until.setHours(formValue.untilHour || 0);
      until.setMinutes(formValue.untilMinute || 0);
      until.setSeconds(0);
      until.setMilliseconds(0);
    }

    const banData = {
      banned: {
        isBanned: formValue.isBanned,
        reason: formValue.isBanned ? formValue.reason : '',
        until: formValue.isBanned ? until : null
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