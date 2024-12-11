import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-cancel-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-cancel-booking.component.html',
  styleUrl: './confirm-cancel-booking.component.css'
})
export class ConfirmCancelBookingComponent {
  bookingId: number;
  isProcessing: boolean = false; 

  constructor(
    public dialogRef: MatDialogRef<ConfirmCancelBookingComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiServiceService
  ) {
    this.bookingId = data.bookingId;
  }

  goBack(): void {
    if (!this.isProcessing) {
      this.dialogRef.close(false);
    }
  }

  cancelBooking(): void {
    if (this.isProcessing) {
      return; 
    }

    console.log(`Attempting to cancel booking ID: ${this.bookingId}`);
    this.isProcessing = true;

    this.apiService.cancelBooking(this.bookingId).subscribe({
      next: () => {
        console.log(`Booking ID ${this.bookingId} canceled successfully.`);
        this.updatePaymentRefund(this.bookingId);
      },
      error: (error: any) => {
        console.error(`Failed to cancel booking ID ${this.bookingId}. Error:`, error);
        alert('Failed to cancel booking.');
        this.isProcessing = false; 
        this.dialogRef.close(false);
      },
    });
  }

  updatePaymentRefund(bookingId: number): void {
    this.apiService.refundPaymentUpdate(bookingId).subscribe({
      next: () => {
        console.log(`Payment refund processed for Booking ID ${bookingId}.`);

        // Show snackbar notification
        this.snackBar.open('Booking canceled and refund processed successfully.', 'Close', {
          duration: 3000, // 3 seconds
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
        this.isProcessing = false; 
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error(`Failed to process refund for Booking ID ${this.bookingId}. Error:`, error);
        alert('Failed to process refund. Please contact support.');
        this.isProcessing = false; 
        this.dialogRef.close(false);
      },
    });
  }
}