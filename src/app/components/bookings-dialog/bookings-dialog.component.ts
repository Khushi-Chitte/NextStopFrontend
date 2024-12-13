import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthserviceService } from '../../services/authservice.service';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

@Component({
  selector: 'app-bookings-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings-dialog.component.html',
  styleUrl: './bookings-dialog.component.css'
})
export class BookingsDialogComponent implements OnInit {
  scheduleId: number;
  userId: number;
  bookings: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  role: any;

  constructor(
      public dialogRef: MatDialogRef<BookingsDialogComponent>,
      private authService: AuthserviceService,
      private apiService: ApiServiceService,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      this.scheduleId = data.scheduleId;
      this.userId = data.userId;

      const pdfMakeInstance = pdfMake as any;
          pdfMakeInstance.vfs = pdfFonts.vfs;
      
          if (!pdfMakeInstance.fonts) {
            pdfMakeInstance.fonts = {};
          }
    }

    ngOnInit(): void {
      console.log(this.scheduleId);

      this.role = this.authService.getUserRoles();

      if(this.scheduleId) {
        this.fetchBookingsByScheduleId();
      }
      else if (this.userId) {
        this.fetchBookingsByUserId();
      }
      
    }

    fetchBookingsByScheduleId(): void {
      this.apiService.fetchBookingByScheduleId(this.scheduleId).subscribe({
        next: (bookings: any) => {
          this.bookings = bookings.filter((booking: any) => booking.status === 'confirmed');
          console.log(bookings);
          this.errorMessage = '';
          this.addFromScheduleDetails()
          this.addFromSeatLogs();
          this.addFromUserDetails();
        },
        error: (error: any) => {
          console.error('Error in catching bookings', error);
          this.errorMessage = 'Error in catching bookings';
        }
      });
    }

    fetchBookingsByUserId(): void {
      this.apiService.fetchBookingByUserId(this.userId).subscribe({
        next: (bookings: any) => {
          this.bookings = bookings.sort((a: any, b: any) => {
            return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
          });
          console.log(bookings);
          this.errorMessage = '';
          this.addFromScheduleDetails();
          this.addFromSeatLogs();
          this.addFromUserDetails();
        },
        error: (error: any) => {
          console.error('Error in catching bookings', error);
          this.errorMessage = 'Error in catching bookings';
        }
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

    addFromUserDetails() {
      this.bookings.forEach((booking: any) => {
        const userId = booking.userId;
  
        this.apiService.getUserByUserId(userId).subscribe({
          next: (user: any) => {
            booking.name = user.name;
          },
          error: (error: any) => {
            console.error(`Failed to fetch details for userId: ${userId}`, error);
            booking.name = 'Unavailable';
          },
        });
      });
    }

    cancelBooking(bookingId: number, userId: number): void {
      if(confirm('Are you sure you want to cancel this booking?')) {
        this.apiService.cancelBooking(bookingId).subscribe({
          next: (response: any) => {
            this.errorMessage = '';
            this.successMessage = `Booking with bookingId: ${bookingId} cancelled successfully`;
            console.log(`Booking with bookingId: ${bookingId} cancelled successfully`, response);
            this.fetchBookingsByScheduleId();
            this.sendNotification(userId, `Booking with bookingId ${bookingId} got cancelled by ${this.role}`);
          },
          error: (error: any) => {
            this.errorMessage = 'Error cancelling booking';
            this.successMessage = '';
            console.error('Error cancelling booking', error);
          },
        });        
      }
    }

    sendNotification(userId: number, message: string) {
      const notifData = {
        userId: userId,
        message: message,
        notificationType: 0
      }
      this.apiService.sendNotification(notifData).subscribe({
        next: (response: any) => {
          console.log('notification sent');
  
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    }

    generatePDF(): void {
      if (!this.bookings) {
            console.error('Generated reports are not available for PDF generation.');
            return;
          }
      
          const docDefinition = this.getPDFDefinition(); 
      
          pdfMake.createPdf(docDefinition)
            .download(`bookings-Report.pdf`);       
    } 


    onClose(): void {
      this.dialogRef.close();  
    }

    getPDFDefinition(): any {
      const header = {
          text: 'Bookings Report',
          style: 'header',
          alignment: 'center',
          margin: [0, 10, 0, 20],
      };
  
      const tableBody = [
          // Define the table headers
          [
              { text: 'Booking ID', bold: true },
              { text: 'Name', bold: true },
              { text: 'Route', bold: true },
              { text: 'Bus Name', bold: true },
              { text: 'Reserved Seats', bold: true },
              { text: 'Total Fare', bold: true },
              { text: 'Status', bold: true },
              { text: 'Booking Date', bold: true },
          ],
      ];
  
      // Populate the table rows with bookings data
      this.bookings.forEach((booking) => {
          tableBody.push([
              booking.bookingId || 'N/A',
              booking.name || 'N/A',
              `${booking.origin || 'N/A'} - ${booking.destination || 'N/A'}`,
              booking.busName || 'N/A',
              booking.seatFromLog,
              `₹${booking.totalFare}` || 'N/A',
              booking.status || 'N/A',
              booking.bookingDate ? booking.bookingDate.split('T')[0] : 'N/A',
          ]);
      });
  
      const table = {
          table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: tableBody,
          },
          layout: 'lightHorizontalLines',
      };
  
      const footer = {
          text: `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
          style: 'footer',
          alignment: 'right',
          margin: [0, 10, 10, 0],
      };
  
      return {
          content: [header, table],
          footer: footer,
          styles: {
              header: {
                  fontSize: 18,
                  bold: true,
              },
              footer: {
                  fontSize: 10,
                  italics: true,
              },
          },
      };
  }  
  
  

}
