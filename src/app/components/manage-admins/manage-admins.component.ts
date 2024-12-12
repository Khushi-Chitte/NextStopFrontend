import { Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-admins.component.html',
  styleUrl: './manage-admins.component.css'
})
export class ManageAdminsComponent {
  admins: any[] = [];
  filteredAdmins: any[] = [];
  searchName: string = '';
  searchEmail: string = '';
  errorMessage: string = '';
    
  constructor(private apiService: ApiServiceService) {}
  
  ngOnInit(): void {
    this.fetchAdmins();
  }
  
  fetchAdmins(): void {
    this.apiService.fetchAllUsers().subscribe({
      next: (users: any[]) => {
        this.admins = users.filter(user => user.role === 'admin');
        this.applySearch();
      },
      error: (error: any) => {
        this.handleError(error);
      },
    });
  }
  
  applySearch(): void {
    const nameFilter = (user: any) =>
      user.name.toLowerCase().includes(this.searchName.toLowerCase());
    const emailFilter = (user: any) =>
      user.email.toLowerCase().includes(this.searchEmail.toLowerCase());
  
    this.filteredAdmins = this.admins.filter(
      user => nameFilter(user) && emailFilter(user)
      );
    }
  
  resetSearch(): void {
    this.searchName = '';
    this.searchEmail = '';
    this.applySearch();
  }
  
  searchByName(): void {
    this.applySearch();
  }
  
  searchByEmail(): void {
    this.applySearch();
  }
  
  handleError(error: any): void {
    this.errorMessage = 'An unexpected error occurred. Please try again later.';
  }
}
