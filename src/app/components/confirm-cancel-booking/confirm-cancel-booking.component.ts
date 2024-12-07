import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-confirm-cancel-booking',
  standalone: true,
  imports: [],
  templateUrl: './confirm-cancel-booking.component.html',
  styleUrl: './confirm-cancel-booking.component.css'
})
export class ConfirmCancelBookingComponent {
  bookingId: number;

  constructor(
    public dialogRef: MatDialogRef<ConfirmCancelBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiServiceService) {
      this.bookingId = data.bookingId; 
   }

  goBack(): void {
    this.dialogRef.close(false);  
  }

  cancelBooking(): void {
    console.log(this.bookingId);

    this.apiService.cancelBooking(this.bookingId).subscribe({
      next: (response: any) => {
        console.log(`Booking ID ${this.bookingId} canceled successfully.`);
        this.updatePaymentRefund(this.bookingId);
        alert('Booking canceled and refund made successfully');
      },

      error: (error: any) => {
        console.error(`Failed to cancel booking ID ${this.bookingId} after payment entry failed. Error:`, error);
        alert('Failed to cancel booking'); 
      },

    });

  }

  updatePaymentRefund(bookingId: number){
    this.apiService.refundPaymentUpdate(bookingId).subscribe({  
      next: (response: any) => {
        console.log(`Payment refund for Booking ID ${bookingId}.`);
      },
      error: (error: any) => {
        console.error(`Failed to refund for booking ID ${this.bookingId} after payment entry failed. Error:`, error);
      },
    });
  }



}
