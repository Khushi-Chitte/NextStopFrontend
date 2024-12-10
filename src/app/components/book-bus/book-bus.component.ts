import { Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBookingComponent } from '../confirm-booking/confirm-booking.component';

@Component({
  selector: 'app-book-bus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-bus.component.html',
  styleUrl: './book-bus.component.css'
})
export class BookBusComponent implements OnInit{
  busId: any;
  scheduleId: any;
  seatsAvailable: number = 0;
  userID: any;
  allSeats: any[] = [];
  allSeatNumbers: any[] = [];
  bookedSeatNumbers: any[] = [];
  selectedSeats: string[] = [];
  seatsToBook: number = 0;
  selectionConfirmed: boolean = false;
  startSeatSelection: boolean = false;
  scheduleDetails: any;
  errorMessage: string = '';
  busDetails: any;
  seats: any[] = [];
  constructor(private route: ActivatedRoute, private apiservice: ApiServiceService, private router: Router, private dialog: MatDialog) { }



  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log('bus book params: ', params);
      this.busId = params['busId'];
      this.scheduleId = params['scheduleId'];
      this.seatsAvailable = params['seatsAvailable'];
    });

      this.userID = localStorage.getItem('userId');
  
      // Fetch all seat numbers
    this.apiservice.fetchBusSeats(this.busId).subscribe({
      next: (allSeats: any[]) => {
        this.allSeats = allSeats;
        this.allSeatNumbers = allSeats.map(seat => seat.seatNumber);

        // Fetch booked seat numbers
        this.apiservice.fetchScheduledSeatsByScheduleId(this.scheduleId).subscribe({
          next: (bookedSeats: any[]) => {
            this.bookedSeatNumbers = bookedSeats.map(seat => seat.seatNumber);

            // Populate seats array with availability data
            this.seats = this.allSeatNumbers.map(seatNumber => ({
              isAvailable: !this.bookedSeatNumbers.includes(seatNumber),
              seatNumber
            }));

            console.log('All seats:', this.seats);
          },
          error: (error: any) => {
            console.error('Error fetching booked seats:', error);
            // Set all seats as available in case of error
            this.seats = this.allSeatNumbers.map(seatNumber => ({
              isAvailable: true,
              seatNumber
            }));
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching all seats:', error);
        alert('Error fetching all seats. Please try again later.');
      }
    });

      this.apiservice.fetchScheduledSeatsByScheduleId(this.scheduleId).subscribe({
        next: (scheduledSeats: any[]) => {
          this.bookedSeatNumbers = scheduledSeats.map(seat => seat.seatNumber); // Extract seat numbers
          console.log('Booked seats numbers:', this.bookedSeatNumbers);
        },
        error: (error: any) => {
          console.error(this.errorMessage, error);
        }
      });
      

      this.apiservice.fetchScheduleDetails(this.scheduleId).subscribe({
        next: (schedule: any) => {
          this.scheduleDetails = schedule;

          console.log('Schedule Details: ', schedule);
        },
        error: (error: any) => {
          this.errorMessage  = 'Failed to fetch schedule details';
          console.error(this.errorMessage, error);
        },
      });

      this.apiservice.fetchBusDetailsById(this.busId).subscribe({
        next: (bus: any) => {
          this.busDetails = bus;
          console.log('Bus Details', bus);
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to fetch bus details';
          console.error(this.errorMessage, error);
        }
      });



  }
  

  toggleSeatSelection(seat: any) {
    if (this.startSeatSelection && seat.isAvailable && !this.selectionConfirmed) {
      const index = this.selectedSeats.indexOf(seat.seatNumber);
      if (index > -1) {
        this.selectedSeats.splice(index, 1); 
      } else if (this.selectedSeats.length < this.seatsToBook) {
        this.selectedSeats.push(seat.seatNumber); 
      }
    }
  }

  startSelection() {
    this.selectedSeats = []; 
    this.startSeatSelection = true;
  }
  
  confirmSelection() {
    if (this.selectedSeats.length === this.seatsToBook) {
      this.selectionConfirmed = true;
      console.log('Selection confirmed:', this.selectedSeats);
    }
  }

  resetSelection() {
    this.selectedSeats = [];
    this.seatsToBook = 0;
    this.selectionConfirmed = false;
    this.startSeatSelection = false;
  }

  getSeatRows(seats: any[]): any[][] {
    const rows: any[][] = [];
    const seatsPerRow = Math.ceil(seats.length / 8); 
  
    for (let i = 0; i < seats.length; i += seatsPerRow) {
      rows.push(seats.slice(i, i + seatsPerRow));
    }
  
    return rows;
  }

  onConfirmBooking() {
    if (this.selectionConfirmed) {
      // Open ConfirmBookingComponent as a dialog
      const dialogRef = this.dialog.open(ConfirmBookingComponent, {
        width: '700px',
        height: 'auto',
        data: {
          selectedSeats: this.selectedSeats,
          busDetails: this.busDetails,
          scheduleDetails: this.scheduleDetails,
          seatsToBook: this.seatsToBook
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          console.log('Booking confirmed and payment successful.');
          alert('Your booking was successful!');
          this.router.navigate(['/app-bookings']);
        } else if (result === false) {
          console.log('Booking process canceled or failed.');
          alert('Booking was canceled or payment failed. Please try again.');
          this.router.navigate(['/app-book-bus']);
        }
      });
    } else {
      alert('Please confirm your seat selection before proceeding.');
    }
  }
}