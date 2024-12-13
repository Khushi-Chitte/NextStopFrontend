import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserDialogComponent } from '../update-user-dialog/update-user-dialog.component';
import { BookingsDialogComponent } from '../bookings-dialog/bookings-dialog.component';

@Component({
  selector: 'app-manage-passengers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-passengers.component.html',
  styleUrls: ['./manage-passengers.component.css']
})
export class ManagePassengersComponent implements OnInit {
  passengers: any[] = [];
  filteredPassengers: any[] = [];
  searchName: string = '';
  searchEmail: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiServiceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchPassengers();
  }

  fetchPassengers(): void {
    this.apiService.fetchAllUsers().subscribe({
      next: (users: any[]) => {
        this.passengers = users.filter(user => user.role === 'passenger');
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

    this.filteredPassengers = this.passengers.filter(
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

  viewBookings(userId: number) {
    const dialogRef = this.dialog.open(BookingsDialogComponent, {
          data: { userId: userId }
        });
  }

  onUpdate(userId: number): void {
    // Update logic
    const userToUpdate = this.passengers.find(passenger => passenger.userId === userId);
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
              this.fetchPassengers();
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
          this.fetchPassengers(); 
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
          this.fetchPassengers(); 
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
