import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthserviceService } from '../../services/authservice.service';

@Component({
  selector: 'app-view-schedules',
  standalone: true,
  imports: [],
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

  reloadSchedules(): void {
    this.loadSchedules();
  }

}
