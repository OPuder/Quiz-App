import { Component } from '@angular/core';
import { StorageService } from '../../services/admin/storage-service.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

  export class AdminComponent {
    userList: any[] = [];
  
    constructor(private storageService: StorageService) {}
  
    ngOnInit() {
      this.loadUserList(); // Benutzerliste beim Laden der Komponente laden
    }
  
    loadUserList(): void {
      this.userList = this.storageService.getUserList();
    }
  
    addUser(newUser: any): void {
      this.storageService.addUser(newUser);
      this.loadUserList(); // Benutzerliste nach Hinzufügen eines neuen Benutzers neu laden
    }
  
    removeUser(email: string): void {
      this.storageService.removeUser(email);
      this.loadUserList(); // Benutzerliste nach Entfernen eines Benutzers neu laden
    }
  }
