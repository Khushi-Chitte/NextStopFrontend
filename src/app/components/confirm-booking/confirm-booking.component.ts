import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-confirm-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-booking.component.html',
  styleUrl: './confirm-booking.component.css'
})
export class ConfirmBookingComponent implements OnInit {
  selectedSeats: string[] = [];
  busDetails: any;
  scheduleDetails: any;
  seatsToBook: number = 0;
  totalFare: number = 0;
  isProcessing: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ConfirmBookingComponent>,
    private router: Router, 
    private apiService: ApiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    this.busDetails = data.busDetails;
    this.scheduleDetails = data.scheduleDetails;
    this.selectedSeats = data.selectedSeats;
    this.seatsToBook = data.seatsToBook;
  }

  ngOnInit() {
    this.selectedSeats = this.data.selectedSeats;
    this.busDetails = this.data.busDetails;
    this.scheduleDetails = this.data.scheduleDetails;
    this.seatsToBook = this.data.seatsToBook;

    this.totalFare = this.data.seatsToBook * this.scheduleDetails.fare;

    console.log('Selected Seats:', this.selectedSeats);
    console.log('Bus Details:', this.busDetails);
    console.log('Schedule Details:', this.scheduleDetails);
    console.log('Seats to Book:', this.seatsToBook);
  }

  makePayment() {
    console.log('Proceeding to payment...');
    this.isProcessing = true;

    if (!this.selectedSeats.length || !this.scheduleDetails || !this.busDetails) {
      console.error('Incomplete booking details. Cannot proceed with payment.');
      this.isProcessing = true;
      alert('Invalid booking details. Please try again.');
      this.dialogRef.close(false);
      return;
    }

    const bookTicketData = {
      userId: parseInt(localStorage.getItem('userId') || '0'), 
      scheduleId: this.scheduleDetails.scheduleId,
      selectedSeats: this.selectedSeats,
    };

    console.log('Book ticket data: ', bookTicketData);

    this.apiService.bookTicket(bookTicketData).subscribe({
      next: (bookingResponse: any) => {
        const updatePaymentData = {
          bookingId: bookingResponse.bookingId,
          amount: bookingResponse.totalFare,
          paymentStatus: 'successful',
        };

        this.apiService.updatePayment(updatePaymentData).subscribe({
          next: (paymentResponse: any) => {
            console.log('Payment successful:', paymentResponse);
            alert('Payment and booking successful!');
            this.dialogRef.close(true);

            this.router.navigate(['/app-bookings'], {
              queryParams: { bookingId: bookingResponse.bookingId },
            });
          },
          error: (paymentError: any) => {
            console.error('Payment failed:', paymentError);
            alert('Payment failed. Please try again.');

            this.cancelBooking(bookingResponse.bookingId);

            this.dialogRef.close(false);

          },
        });

      },
      error: (bookingError: any) => {
        console.error('Booking failed:', bookingError);
        alert('Booking failed. Please try again.');
        this.dialogRef.close(false);
      },
      complete: () => {
        this.isProcessing = false;
      },
    });

  }

  cancelBooking(bookingId: any) {
    this.apiService.cancelBooking(bookingId).subscribe({
      next: () => {
        console.log(`Booking ID ${bookingId} canceled successfully because payment entry failed.`);
      },
      error: (error: any) => {
        console.error(`Failed to cancel booking ID ${bookingId} after payment entry failed. Error:`, error);
      },
    });
  }
  

  goBack() {
    this.dialogRef.close(false);
  }
}
