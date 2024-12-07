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
  seats: any[] = [];
  selectedSeats: string[] = [];
  seatsToBook: number = 0;
  selectionConfirmed: boolean = false;
  startSeatSelection: boolean = false;
  scheduleDetails: any;
  errorMessage: string = '';
  busDetails: any;
  constructor(private route: ActivatedRoute, private apiservice: ApiServiceService, private router: Router, private dialog: MatDialog) { }


  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log('bus book params: ', params);
      this.busId = params['busId'];
      this.scheduleId = params['scheduleId'];
      this.seatsAvailable = params['seatsAvailable'];
    });

      this.userID = localStorage.getItem('userId');
  
      this.apiservice.fetchBusSeats(this.busId).subscribe({
        next: (seats: any) => {
          this.seats = seats;
          console.log('Fetched seats:', this.seats);
        },
        error: (error: any) => {
          console.error('Error fetching seats:', error);
          alert('Error fetching seats. Please try again later.');
        },
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
        if (result === false) {
          this.router.navigate(['/app-book-bus']);
        } else if (result) {
          console.log('Booking Confirmed:', result);
        }
      });
    } else {
      alert('Please confirm your seat selection before proceeding.');
    }
  }
  


}
