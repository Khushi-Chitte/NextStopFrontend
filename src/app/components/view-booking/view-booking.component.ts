import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCancelBookingComponent } from '../confirm-cancel-booking/confirm-cancel-booking.component';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

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
  paymentDetails: any;
  seatLogDetails: any;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiServiceService, private dialog: MatDialog) {
    const pdfMakeInstance = pdfMake as any;
    pdfMakeInstance.vfs = pdfFonts.vfs;

    if (!pdfMakeInstance.fonts) {
      pdfMakeInstance.fonts = {};
    }
  }
  


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'];
      this.scheduleId = params['scheduleId'];

      if(this.bookingId) {
        this.fetchBooking(this.bookingId);
        this.fetchPaymentStatus(this.bookingId);
        this.fetchSeatLog(this.bookingId);
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

  fetchSeatLog(bookingId :number) {
    this.apiService.fetchSeatLogs(bookingId).subscribe({
      next: (seatLog: any) => {
        this.seatLogDetails = seatLog;
        console.log('SeatLog Details: ', seatLog);
      },
      error: (error: any) => {
        this.errorMessage = 'Unable to fetch SeatLog details.';
        console.error(this.errorMessage, error);
      },
    });
  }

  fetchPaymentStatus(bookingId: any) {
    this.apiService.fetchPaymentStatus(bookingId).subscribe({
      next: (payment: any) => {
        this.paymentDetails = payment;
      },
      error: (error: any) => {
        this.errorMessage = 'Unable to fetch payment details.';
        console.error(this.errorMessage, error);
      }
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
        this.successMessage = 'Booking canceled successfully and payment refunded!';
        this.errorMessage = null;
        this.fetchBooking(this.bookingId);
        this.fetchPaymentStatus(this.bookingId);
        console.log('Booking canceled with ID: ', this.bookingId);
      } else {
        console.log('Booking cancellation aborted');
        this.errorMessage = 'Booking cancellation aborted';
      }
    });
  }

  generatePDF() : void {
    if (!this.bookingDetails) {
      console.error('Booking details not available for PDF generation.');
      return;
    }

    const docDefinition = this.getPDFDefinition(); 

    pdfMake.createPdf(docDefinition)
      .download('booking-details.pdf'); 
  }

  getPDFDefinition(): any {
    return {
      content: [
        {
          text: 'Booking Details',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 20],
        },
        {
          table: {
            widths: ['25%', '75%'], 
            body: [
              [
                { text: 'Booking ID:', bold: true },
                this.bookingDetails?.bookingId || 'Data not available',
              ],
              [
                { text: 'Route:', bold: true },
                `${this.scheduleDetails?.origin || 'Unknown'} - ${this.scheduleDetails?.destination || 'Unknown'}`,
              ],
              [
                { text: 'Bus Name:', bold: true },
                this.scheduleDetails?.busName || 'Data not available',
              ],
              [
                { text: 'Reserved Seats:', bold: true },
                this.seatLogDetails?.seats || 'No seats reserved',
              ],
              [
                { text: 'Departure Date:', bold: true },
                this.scheduleDetails?.departureTime
                  ? this.getTextRepresentation(this.scheduleDetails.departureTime)
                  : 'Data not available',
              ],
              [
                { text: 'Departure Time:', bold: true },
                this.scheduleDetails?.departureTime
                  ? this.getTextRepresentation(this.scheduleDetails.departureTime, true)
                  : 'Data not available',
              ],
              [
                { text: 'Arrival Date:', bold: true },
                this.scheduleDetails?.arrivalTime
                  ? this.getTextRepresentation(this.scheduleDetails.arrivalTime)
                  : 'Data not available',
              ],
              [
                { text: 'Arrival Time:', bold: true },
                this.scheduleDetails?.arrivalTime
                  ? this.getTextRepresentation(this.scheduleDetails.arrivalTime, true)
                  : 'Data not available',
              ],
              [
                { text: 'Total Fare:', bold: true },
                `₹${this.bookingDetails?.totalFare || 'Data not available'}`,
              ],
              [
                { text: 'Status:', bold: true },
                this.bookingDetails?.status || 'Data not available',
              ],
              [
                { text: 'Booking Date:', bold: true },
                this.bookingDetails?.bookingDate
                  ? this.getTextRepresentation(this.bookingDetails.bookingDate)
                  : 'Data not available',
              ],
              [
                { text: 'Payment Status:', bold: true },
                this.paymentDetails?.paymentStatus || 'Data not available',
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        },
        {
          text: 'Thank you for booking with NextStop!',
          fontSize: 12,
          alignment: 'center',
          margin: [0, 20, 0, 0],
        },
      ],
    };
  }
  
  

  getTextRepresentation(dateTime: any, formatTime?: boolean): string {
    if (typeof dateTime === 'string' && !isNaN(Date.parse(dateTime))) {
      const date = new Date(dateTime);
      if (formatTime) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    }
    return 'N/A'; 
  }
  
  

}