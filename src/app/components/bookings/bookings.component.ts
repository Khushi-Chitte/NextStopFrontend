import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent implements OnInit{
  bookings: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private apiService: ApiServiceService, private router: Router) { }

  ngOnInit(): void {
    this.apiService.fetchUserBookings().subscribe({
      next: (booking: any) => {
        this.bookings = booking;
        console.log('Booking Details: ',booking);
        
        this.addFromScheduleDetails();

      },
      error: (error: any) => {
        this.errorMessage = 'Failed to fetch booking details';
        console.error(this.errorMessage);
      }
    });
  }

  addFromScheduleDetails(): void {
    this.bookings.forEach((booking: any) => {
      const scheduleId = booking.scheduleId;

      this.apiService.fetchScheduleDetails(scheduleId).subscribe({
        next: (schedule: any) => {
          booking.busName = schedule.busName;
          booking.origin = schedule.origin;
          booking.destination = schedule.destination;
        },
        error: (error: any) => {
          console.error(`Failed to fetch details for scheduleId: ${scheduleId}`, error);
          booking.busName = 'Unavailable';
          booking.origin = 'Unavailable';
          booking.destination = 'Unavailable';
        },
      });
    });
  }  

  onView(booking: any) {
    console.log("View Booking", booking);
    this.router.navigate(['/app-view-booking'], {
      queryParams: { 
        bookingId: booking.bookingId,
        scheduleId: booking.scheduleId
       }
    });
  }
}