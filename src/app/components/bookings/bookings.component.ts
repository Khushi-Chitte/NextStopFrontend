import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent implements OnInit{
  bookings: any[] = [];
  filteredBookings: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  searchOrigin: string = '';
  searchDestination: string = '';
  searchBookingDate: string = '';

  constructor(private apiService: ApiServiceService, private router: Router) { }

  ngOnInit(): void {
    this.apiService.fetchUserBookings().subscribe({
      next: (booking: any) => {
        this.bookings = booking;
        
        this.bookings = booking.sort((a: any, b: any) => {
          return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
        });
        console.log('Booking Details (Sorted): ', this.bookings);
        
        this.addFromScheduleDetails();
        this.addFromSeatLogs();
        this.filteredBookings = [...this.bookings]; 

      },
      error: (error: any) => {
        this.handleError(error);
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

  addFromSeatLogs() {
    this.bookings.forEach((booking: any) => {
      const bookingId = booking.bookingId;

      this.apiService.fetchSeatLogs(bookingId).subscribe({
        next: (seatLog: any) => {
          booking.seatFromLog = seatLog.seats;
        },
        error: (error : any) => {
          console.error(`Failed to fetch seat log for bookingId: ${bookingId}`, error);
          booking.seatFromLog = 'Unavailable'
        },
      });

    });
  }

  handleError(error: any) {
    if (error.error) {
      if (typeof error.error === 'string') {
        this.errorMessage = error.error;
      } else if (error.error.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Failed to fetch booking details';
      }
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
    console.error(this.errorMessage, error);
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

  filterBookings(): void {
    this.filteredBookings = this.bookings.filter((booking) => {
      return (
        (this.searchOrigin ? booking.origin.toLowerCase().includes(this.searchOrigin.toLowerCase()) : true) &&
        (this.searchDestination ? booking.destination.toLowerCase().includes(this.searchDestination.toLowerCase()) : true) &&
        (this.searchBookingDate ? booking.bookingDate.split('T')[0] === this.searchBookingDate : true)
      );
    });
  }

  resetFilters(): void {
    this.searchOrigin = '';
    this.searchDestination = '';
    this.searchBookingDate = '';
    this.filteredBookings = [...this.bookings]; // Reset to original bookings list
  }
  
}