import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCancelBookingComponent } from '../confirm-cancel-booking/confirm-cancel-booking.component';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { NotificationService } from '../../services/notification.service';
import { CreateFeedbackDialogComponent } from '../create-feedback-dialog/create-feedback-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateDeleteFeedbackComponent } from '../update-delete-feedback/update-delete-feedback.component';

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
  feedbackMessage: string | null = null;
  isFeedbackDisabled: boolean = false;

  feedbackExist: boolean = false;
 

  constructor(private route: ActivatedRoute, private apiService: ApiServiceService,
     private dialog: MatDialog, private notificationService: NotificationService,
    private snackBar: MatSnackBar) {
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

    this.apiService.getFeedbackByBookingId(this.bookingId).subscribe({
      next: (feedback: any) => {
        if(feedback && feedback.length>0) {
          this.feedbackExist = true;
        }
        else if(feedback && feedback.length===0) {
          this.feedbackExist = false;
        }
      },
      error: (error: any) => {
        console.error('Cannot fetch feedbacks', error);
      },
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
        this.sendNotification(`Booking with Booking Id: ${this.bookingId} cancelled successfully`);
        console.log('Booking canceled with ID: ', this.bookingId);
      } else {
        console.log('Booking cancellation aborted');
        this.errorMessage = 'Booking cancellation aborted';
      }
    });
  }

  sendNotification(message: string) {
    const notifData = {
      userId: parseInt(localStorage.getItem('userId') || '0'),
      message: message,
      notificationType: 0
    }
    this.apiService.sendNotification(notifData).subscribe({
      next: (response: any) => {
        console.log('notification sent');

        this.notificationService.notifyNewNotification();
        
      },
      error: (error: any) => {
        console.log(error);
      },
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
        // Header with App Name and Logo
        {
          margin: [0, 0, 0, 20],
          columns: [
            {
              image: 'data:image/jpeg;base64,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',  // Provide a base64 logo or use an image URL
              width: 30,
              height: 30,
            },
            {
              text: 'NextStop - Bus Ticket Booking',  // App name
              fontSize: 22,
              bold: true,
              color: '#004d99',  // Brand color
              alignment: 'left',
              margin: [7, 5],
            }
          ]
        },
        {
          text: 'Booking Details',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 20],
          color: '#0066cc',  // Title color
        },
        // Card Style - Booking Info Card
        {
          layout: 'lightHorizontalLines',  // Light card-like border
          table: {
            widths: ['25%', '75%'],
            body: [
              [
                { text: 'Booking ID:', bold: true, color: '#ff6600' },
                { text: this.bookingDetails?.bookingId || 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Route:', bold: true, color: '#ff6600' },
                { text: `${this.scheduleDetails?.origin || 'Unknown'} - ${this.scheduleDetails?.destination || 'Unknown'}`, color: '#333333' },
              ],
              [
                { text: 'Bus Name:', bold: true, color: '#ff6600' },
                { text: this.scheduleDetails?.busName || 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Reserved Seats:', bold: true, color: '#ff6600' },
                { text: this.seatLogDetails?.seats || 'No seats reserved', color: '#333333' },
              ],
              [
                { text: 'Departure Date:', bold: true, color: '#ff6600' },
                { text: this.scheduleDetails?.departureTime
                  ? this.getTextRepresentation(this.scheduleDetails.departureTime)
                  : 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Departure Time:', bold: true, color: '#ff6600' },
                { text: this.scheduleDetails?.departureTime
                  ? this.getTextRepresentation(this.scheduleDetails.departureTime, true)
                  : 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Arrival Date:', bold: true, color: '#ff6600' },
                { text: this.scheduleDetails?.arrivalTime
                  ? this.getTextRepresentation(this.scheduleDetails.arrivalTime)
                  : 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Arrival Time:', bold: true, color: '#ff6600' },
                { text: this.scheduleDetails?.arrivalTime
                  ? this.getTextRepresentation(this.scheduleDetails.arrivalTime, true)
                  : 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Total Fare:', bold: true, color: '#ff6600' },
                { text: `₹${this.bookingDetails?.totalFare || 'Data not available'}`, color: '#333333' },
              ],
              [
                { text: 'Status:', bold: true, color: '#ff6600' },
                { text: this.bookingDetails?.status || 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Booking Date:', bold: true, color: '#ff6600' },
                { text: this.bookingDetails?.bookingDate
                  ? this.getTextRepresentation(this.bookingDetails.bookingDate)
                  : 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Payment Status:', bold: true, color: '#ff6600' },
                { text: this.paymentDetails?.paymentStatus || 'Data not available', color: '#333333' },
              ],
            ],
          },
          margin: [0, 0, 0, 20],
        },
        {
          text: 'Thank you for booking with NextStop!',
          fontSize: 12,
          alignment: 'center',
          margin: [0, 20, 0, 0],
          color: '#28a745',  // Thank you text color
        },
      ],
      pageSize: 'A4',  // Paper size
      pageMargins: [40, 60, 40, 60],  // Page margins
      styles: {
        header: {
          bold: true,
          fontSize: 15,
          color: '#ff6600',  // Header color
        },
        subheader: {
          bold: true,
          fontSize: 12,
          color: '#ff6600',
        },
        content: {
          fontSize: 12,
          color: '#333333',
        },
      },
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

  isCancelBookingDisabled(): boolean {
    const currentDate = new Date();
    const departureDate = new Date(this.scheduleDetails?.departureTime);
  
    return currentDate >= departureDate || this.bookingDetails?.status === 'cancelled';
  }
  

  onGiveFeedback() {
    const currentDate = new Date();
    const arrivalDate = new Date(this.scheduleDetails?.arrivalTime);

    if (currentDate < arrivalDate) {
      this.feedbackMessage = 'You can only give feedback after the bus has completed the trip.';
      this.isFeedbackDisabled = true;  
    } else {
      this.isFeedbackDisabled = false;

      this.apiService.getFeedbackByBookingId(this.bookingId).subscribe({
        next: (feedback: any) => {
          if(feedback && feedback.length>0) {
            console.log('update-delete feedback');
            this.feedbackExist = true;

            const feedbackId = feedback[0].feedbackId;

            const dialogRef = this.dialog.open(UpdateDeleteFeedbackComponent, {
              data: {
                rating: feedback[0].rating,
                feedbackText: feedback[0].feedbackText
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              if(result?.action === 'update') {
                const feedbackData = {
                  rating: result.feedback.rating,
                  feedbackText: result.feedback.feedbackText
                }

                console.log('Update data', feedbackData);

                this.apiService.updateFeedback(feedbackId, feedbackData).subscribe({
                  next: (response: any) => {
                    this.snackBar.open('Feedback updated successfully!', 'Close', {
                      duration: 3000,
                      horizontalPosition: 'right',
                      verticalPosition: 'bottom',
                    });
                    console.log('feedback updated successfully', response);
                    this.ngOnInit();
                  },
                  error: (error: any) => {
                    this.snackBar.open('Error updating feedback', 'Close', {
                      duration: 3000,
                      horizontalPosition: 'right',
                      verticalPosition: 'bottom',
                    });

                    console.error('Error updating feedback', error);
                  }
                });

              } else if(result?.action === 'delete') {
                console.log('delete feedback');
                this.apiService.deleteFeedback(feedbackId).subscribe({
                  next: (response: any) => {
                    this.snackBar.open('Feedback deleted successfully!', 'Close', {
                      duration: 3000,
                      horizontalPosition: 'right',
                      verticalPosition: 'bottom',
                    });
                    console.log('feedback updated successfully', response);
                    this.ngOnInit();
                  },
                  error: (error: any) => {
                    this.snackBar.open('Error deleting feedback', 'Close', {
                      duration: 3000,
                      horizontalPosition: 'right',
                      verticalPosition: 'bottom',
                    });

                    console.error('Error updating feedback', error);
                  }
                });
              }
            });

          }
          else if(feedback && feedback.length===0) {
            console.log('submit feedback');

            const dialogRef = this.dialog.open(CreateFeedbackDialogComponent, {
              data: {
                bookingId: this.bookingId,
              }
            });

            dialogRef.afterClosed().subscribe(feedback => {
                if(feedback) {
                  const feedbackData = {
                    bookingId: parseInt(this.bookingId),
                    rating: feedback.rating,
                    feedbackText: feedback.feedbackText
                  }
                  
                  console.log(feedbackData);

                  this.apiService.addFeedback(feedbackData).subscribe({
                    next: (response: any) => {
                      console.log('Feedback added successfully', response);
                      this.snackBar.open('Feedback added successfully!', 'Close', {
                        duration: 3000,
                        horizontalPosition: 'right',
                        verticalPosition: 'bottom',
                      });

                      this.ngOnInit();  


                    },
                    error: (error: any) => {
                      console.error('Cannot add feedback: ', error);
                    },
                  });

                }
            });

            
          }
        },
        error: (error: any) => {
          console.error(error);
        },
      });

    }
  }

  

  

}