import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
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


export interface BanPayload {
  banned: {
    isBanned: boolean;
    reason: string;
    until: Date | null;
  };
}

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
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
  ],
  templateUrl: './bann-user-modal.component.html',
  styleUrl: './bann-user-modal.component.css'
})

export class BanUserModalComponent {
  banForm: FormGroup;
  minDate: Date = new Date();
  
  constructor(
    public dialogRef: MatDialogRef<BanUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userService: UserManagementService
  ) {
    this.banForm = this.fb.group({
      isBanned: [this.data.user?.banned?.isBanned || false],
      reason: [this.data.user?.banned?.reason || ''],
      untilDate: [this.data.user?.banned?.until ? new Date(this.data.user.banned.until) : new Date()],
      untilHour: [0],
      untilMinute: [0]
    });

    this.banForm.get('isBanned')?.valueChanges.subscribe((banned: boolean) => {
      if (banned) {
        this.banForm.patchValue({ untilDate: new Date() });
      } else {
        this.banForm.patchValue({
          untilDate: new Date(),
          untilHour: 0,
          untilMinute: 0
        });
      }
    });
  }

  private combineDateTime(formValue: any): Date | null {
    if (formValue.isBanned) return null;
    
    const now = new Date();
    const totalMinutes = (formValue.untilHour || 0) * 60 + (formValue.untilMinute || 0);
  
    if (totalMinutes === 0) return null;
  
    return new Date(now.getTime() + totalMinutes * 60000);
  }

  submitBan(): void {
    const formValue = this.banForm.value;

    if (
      !formValue.isBanned &&
      formValue.untilDate &&
      new Date(formValue.untilDate) < this.minDate
    ) {
      alert('Das Bann-Enddatum darf nicht in der Vergangenheit liegen.');
      return;
    }

    const banData: BanPayload = {
      banned: {
        isBanned: !formValue.isBanned,
        reason: !formValue.isBanned ? formValue.reason : '',
        until: !formValue.isBanned ? this.combineDateTime(formValue) : null
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