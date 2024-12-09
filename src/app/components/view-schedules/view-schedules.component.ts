import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthserviceService } from '../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-schedules.component.html',
  styleUrl: './view-schedules.component.css'
})
export class ViewSchedulesComponent implements OnInit, OnDestroy {
  schedules: any[] = [];
  filteredSchedules: any[] = [];
  errorMessage: string = '';
  isAdmin: boolean = false;

  isAuthenticated: boolean = false;
  private authStatusSubscription!: Subscription;

  constructor(private apiService: ApiServiceService, private authService : AuthserviceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRoles() === 'admin';
    this.loadSchedules();

    this.authStatusSubscription = this.authService.isAuthenticated$.subscribe(status =>  {
      this.isAuthenticated = status;
    });
  }

  ngOnDestroy(): void {
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }    
  }

  loadSchedules(): void {
    if(this.isAdmin) {
      this.loadScheduleAdmin();
    } else {
      this.loadScheduleOperator();
    }  
  }

  loadScheduleOperator(): void {
    this.apiService.fetchSchedulesByOperatorId().subscribe({
      next: (schedules: any) => {
        this.schedules = schedules;
        this.filteredSchedules = schedules;
        console.log(schedules);
      },
      error: (error: any) => {
        this.handleError(error);
        console.log(error);
      }
    });    
  }

  loadScheduleAdmin(): void {
    this.apiService.fetchAllSchedules().subscribe({
      next: (schedules: any) => {
        this.schedules = schedules;
        this.filteredSchedules = schedules;
      },
      error: (error: any) => {
        this.handleError(error);
      }
    });
  }

  onUpdate(scheduleId: any) {
    if(!this.isAuthenticated) {
      alert('Login first to update');
    } else {
      const scheduleToUpdate = this.schedules.find(schedule => schedule.scheduleId === scheduleId);

      console.log('Update schedule: ', scheduleToUpdate);

      //will do
    }
  }

  onDelete(scheduleId: any) {
    if(!this.isAuthenticated) {
      alert('Login first to delete');
    } else {
      console.log('Delete schedule');
    }
  }

  resetSearch(): any {
    this.filteredSchedules = [...this.schedules];
  }

  handleError(error: any) {
    if (error.error) {
      if (typeof error.error === 'string') {
        this.errorMessage = error.error;
      } else if (error.error.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Failed to process the schedule. Please try again';
      }
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
    console.error(this.errorMessage, error);
  }

  reloadSchedules(): void {
    this.loadSchedules();
  }

}
