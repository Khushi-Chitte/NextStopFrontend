import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthserviceService } from '../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateScheduleComponent } from '../update-schedule/update-schedule.component';
import { BookingsDialogComponent } from '../bookings-dialog/bookings-dialog.component';

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
  schedulesNew: any[] = [];
  currentFilter: string = 'latest';

  isAuthenticated: boolean = false;
  private authStatusSubscription!: Subscription;

  busNumberSearch: string = '';
  departureDateSearch: string = '';

  constructor(private apiService: ApiServiceService, private authService : AuthserviceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRoles() === 'admin';
    this.loadSchedules();

    this.filterNewSchedules();

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
        this.filterNewSchedules();
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
        this.filterNewSchedules();
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

      if(scheduleToUpdate) {
        const dialogRef = this.dialog.open(UpdateScheduleComponent, {
          data: {...scheduleToUpdate}
        });

        dialogRef.afterClosed().subscribe(updatedSchedule => {
          if(updatedSchedule) {
            this.apiService.updateSchedule(scheduleId, updatedSchedule).subscribe({
              next: (response: any) => {
                console.log('Schedule updated:', response);
                this.loadSchedules();
              },
              error: (error) => {
                console.error('Error updating schedule: ', error);
                this.handleError(error);
              }
            });
          }
        });

      }
    }
  }

  filterNewSchedules(): void {
    const today = new Date().setHours(0, 0, 0, 0); 
    this.schedulesNew = this.schedules.filter(schedule => {
      const departureDate = new Date(schedule.departureTime).setHours(0, 0, 0, 0); 
      return departureDate >= today; 
    });

    this.filteredSchedules = [...this.schedulesNew];
    this.currentFilter = 'latest';
  }

  showAllSchedules(): void {
    this.filteredSchedules = [...this.schedules];
    this.currentFilter = 'all'; 
  }

  onDelete(scheduleId: any) {
    if(!this.isAuthenticated) {
      alert('Login first to delete');
    } else {
      console.log('Delete Schedule', scheduleId);
      if(confirm('Are you sure you want to delete this Schedule?(⚠️all related data will be lost)')) {
        this.deleteSchedule(scheduleId);
      }
    }
  }

  deleteSchedule(scheduleId: any) {
    this.apiService.deleteSchedule(scheduleId).subscribe({
      next: (response: any) => {
        console.log(`schedule with scheduleID ${scheduleId} deleted`);
        this.loadSchedules();
      },
      error: (error: any) => {
        console.log(`error deleting schedule with scheduleID ${scheduleId}`)
        this.errorMessage = 'error deleting schedule';
      },
    });
  }

  isSchedulePast(departureTime: string): boolean {
    const currentDate = new Date();
    const scheduleDate = new Date(departureTime);
  
    return scheduleDate < currentDate;
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

  viewBookings(scheduleId: number){
    const dialogRef = this.dialog.open(BookingsDialogComponent, {
      data: { scheduleId: scheduleId }
    });

  }

  onSearch(): void {
    this.filteredSchedules = this.schedules.filter(schedule => {
      const matchesBusNumber = this.busNumberSearch ? schedule.busNumber.includes(this.busNumberSearch) : true;
      const matchesDate = this.departureDateSearch ? new Date(schedule.departureTime).toLocaleDateString() === new Date(this.departureDateSearch).toLocaleDateString() : true;
      return matchesBusNumber && matchesDate;
    });
  }

  resetSearch(): any {
    this.busNumberSearch = '';  
    this.departureDateSearch = '';  
    this.filteredSchedules = [...this.schedules]; 
    this.filterNewSchedules();  
  }
  

  reloadSchedules(): void {
    this.loadSchedules();
  }

}
