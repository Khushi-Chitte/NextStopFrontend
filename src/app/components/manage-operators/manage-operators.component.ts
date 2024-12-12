import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserDialogComponent } from '../update-user-dialog/update-user-dialog.component';

@Component({
  selector: 'app-manage-operators',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-operators.component.html',
  styleUrl: './manage-operators.component.css'
})
export class ManageOperatorsComponent implements OnInit{
  operators: any[] = [];
  filteredOperators: any[] = [];
  searchName: string = '';
  searchEmail: string = '';
  errorMessage: string = '';
  
  constructor(private apiService: ApiServiceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchOperators();
  }

  fetchOperators(): void {
    this.apiService.fetchAllUsers().subscribe({
      next: (users: any[]) => {
        this.operators = users.filter(user => user.role === 'operator');
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

    this.filteredOperators = this.operators.filter(
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

  onUpdate(userId: number): void {
    // Update logic
    const userToUpdate = this.operators.find(operator => operator.userId === userId);
        console.log(userToUpdate);
    
        if (userToUpdate) {
          const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
            data: { ...userToUpdate }  
          });
    
          dialogRef.afterClosed().subscribe(updatedUser => {
            if(updatedUser) {
              this.apiService.updateUserByAdmin(updatedUser).subscribe({
                next: (response: any) => {
                  console.log('User updated: ', response);
                  this.fetchOperators();
                },
                error: (error: any) => {
                  this.handleError(error);
                }
              });
            }
          });
    
        }
  }

  onDelete(userId: number): void {
    // Delete logic

    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUserByAdmin(userId).subscribe({
        next: (response) => {
          console.log('user deleted:', response);
          this.fetchOperators(); 
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  onReactivate(userId: number): void {
    // Reactivate logic
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.reactivateUserByAdmin(userId).subscribe({
        next: (response) => {
          console.log('user reactivated:', response);
          this.fetchOperators(); 
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  handleError(error: any) {
    if (error.error) {
      if (typeof error.error === 'string') {
        this.errorMessage = error.error;
      } else if (error.error.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Failed to process request. Please try again';
      }
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
    console.error(this.errorMessage, error);
  }  
  
  
}
