import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-cancel-booking',
  standalone: true,
  imports: [],
  templateUrl: './confirm-cancel-booking.component.html',
  styleUrl: './confirm-cancel-booking.component.css'
})
export class ConfirmCancelBookingComponent {
  bookingId: number;

  constructor(public dialogRef: MatDialogRef<ConfirmCancelBookingComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.bookingId = data.bookingId; 
   }

  goBack(): void {
    this.dialogRef.close(false);  
  }

  cancelBooking(): void {
    console.log(this.bookingId);
    this.dialogRef.close(true);  
  }

}
