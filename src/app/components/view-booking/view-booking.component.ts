import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCancelBookingComponent } from '../confirm-cancel-booking/confirm-cancel-booking.component';

@Component({
  selector: 'app-view-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-booking.component.html',
  styleUrl: './view-booking.component.css'
})
export class ViewBookingComponent implements OnInit {
  bookingId: any;
  scheduleId: any;
  bookingDetails: any;
  scheduleDetails: any;
  errorMessage: any;

  constructor(private route: ActivatedRoute, private apiService: ApiServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'];
      this.scheduleId = params['scheduleId'];

      if(this.bookingId) {
        this.fetchBooking(this.bookingId);
      }

      if(this.scheduleId) {
        this.fetchSchedule(this.scheduleId);
      }

    });
  }

  fetchBooking(bookingId: any) {
    this.apiService.fetchUserBookingByBookingId(bookingId).subscribe({
      next: (booking: any) => {
        this.bookingDetails = booking;
        console.log('Booking Details: ', booking);
      },
      error: (error: any) => {
        this.errorMessage = 'Unable to fetch booking details.';
        console.error(this.errorMessage, error);
      },
    });
  }

  fetchSchedule(scheduleId: any) {
    this.apiService.fetchScheduleDetails(scheduleId).subscribe({
      next: (schedule: any) => {
        this.scheduleDetails = schedule;
        console.log('Schedule Details: ', schedule);
      },
      error: (error: any) => {
        this.errorMessage = 'Unable to fetch schedule details.';
        console.error(this.errorMessage, error);
      },
    });
  }

  onCancelBooking() {
    const dialogRef = this.dialog.open(ConfirmCancelBookingComponent, {
      width: '600px',
      height: 'auto',
      data: { bookingId: this.bookingId }  
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Booking canceled with ID: ', this.bookingId);
      } else {
        console.log('Booking cancellation aborted');
      }
    });
  }



  

}
