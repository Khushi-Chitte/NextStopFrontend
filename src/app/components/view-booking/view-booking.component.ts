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
import { logo_base64 } from '../../../assets/logo_base64';

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

  convertToIST(utcDate: string): string {
    const date = new Date(utcDate);
    const istOffset = 5.5 * 60; // IST offset is UTC +5:30
    date.setMinutes(date.getMinutes() + istOffset);  // Adjust the date to IST
    return date.toISOString();  // or use date.toLocaleString() depending on your needs
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

  convertToIST_PDF(utcDate: string): { date: string, time: string } {
    const date = new Date(utcDate);
  
    // Add IST offset (5 hours 30 minutes) to UTC time
    const IST_OFFSET = 5 * 60 + 30; // IST is UTC+5:30 in minutes
    date.setMinutes(date.getMinutes() + IST_OFFSET);
  
    // Format the date and time separately
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
    return {
      date: date.toLocaleDateString('en-US', dateOptions),
      time: date.toLocaleTimeString('en-US', timeOptions),
    };
  }
  
  

  getPDFDefinition(): any {
    return {
      content: [
        // Header with App Name and Logo
        {
          margin: [0, 0, 0, 20],
          columns: [
            {
              image: logo_base64.image,
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
                  ?  this.convertToIST_PDF(this.scheduleDetails.departureTime).date
                  : 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Departure Time:', bold: true, color: '#ff6600' },
                { text: this.scheduleDetails?.departureTime
                  ? this.convertToIST_PDF(this.scheduleDetails.departureTime).time
                  : 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Arrival Date:', bold: true, color: '#ff6600' },
                { text: this.scheduleDetails?.arrivalTime
                  ? this.convertToIST_PDF(this.scheduleDetails.arrivalTime).date
                  : 'Data not available', color: '#333333' },
              ],
              [
                { text: 'Arrival Time:', bold: true, color: '#ff6600' },
                { text: this.scheduleDetails?.arrivalTime
                  ? this.convertToIST_PDF(this.scheduleDetails.arrivalTime).time
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

    const IST_OFFSET = 5 * 60 + 30;

    departureDate.setMinutes(departureDate.getMinutes() + IST_OFFSET);
  
    return currentDate >= departureDate || this.bookingDetails?.status === 'cancelled';
  }
  

  onGiveFeedback() {
    const currentDate = new Date();
    const arrivalDate = new Date(this.scheduleDetails?.arrivalTime);

    const IST_OFFSET = 5 * 60 + 30;

    arrivalDate.setMinutes(arrivalDate.getMinutes() + IST_OFFSET);



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