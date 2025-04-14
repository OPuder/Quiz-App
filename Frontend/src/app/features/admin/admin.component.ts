import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';  
import { UserManagementService } from '../../services/admin/user-management.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserModalComponent } from '../../component/add-user-modal/add-user-modal.component';
import { User } from '../../shared/models/user.model';
import { EditUserModalComponent } from '../../component/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  displayedColumns: string[] = [
    'vorname',
    'nachname',
    'spitzname',
    'email',
    'securityQuestion',
    'role',
    'aktionen'
  ];
  userList: any[] = [];
  selectedUser: any = {};
  newUser: any = {}
  showAddUserForm!: boolean;
  errorMessage: string = '';

  constructor(
    private userManagementService: UserManagementService,
    private dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.loadUserList(); 
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userManagementService.addUser(result).subscribe({
          next: (response) => {
            this.loadUserList();
          },
          error: (err) => {
            console.error('Fehler beim Hinzufügen des Benutzers:', err);
            alert('Fehler beim Hinzufügen des Benutzers');
          }
        });
      }
    });
  }

  loadUserList(): void {
    this.userManagementService.getUsers().subscribe({
      next: (response) => {
        this.userList = response;
      },
      error: (error) => {
        this.errorMessage = 'Fehler beim Laden der Benutzer';
      }
    });
  }

  removeUser(id: string): void {
    this.userManagementService.deleteUser(id).subscribe(
      (response: any) => {
        this.loadUserList();
      },
      (error) => {
        console.error('Fehler beim Löschen des Benutzers', error);
      }
    );
  }

  editUser(user: any): void {
    this.selectedUser = { ...user };
    this.openEditUserModal(this.selectedUser);
  }

  openEditUserModal(user: User): void {
    const dialogRef = this.dialog.open(EditUserModalComponent, {
      width: '400px',
      data: user,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserList();
      }
    });
  }
}
