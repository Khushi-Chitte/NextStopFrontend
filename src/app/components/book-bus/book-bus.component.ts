import { Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  seats: Signal<any[]>;
  selectedSeats: string[] = [];
  seatsToBook: number = 0;
  selectionConfirmed: boolean = false;
  startSeatSelection: boolean = false;
  
  constructor(private route: ActivatedRoute, private apiservice: ApiServiceService) {
    this.seats = this.apiservice.allBusSeats;
  }


  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log('bus book params: ', params);
      this.busId = params['busId'];
      this.scheduleId = params['scheduleId'];
      this.seatsAvailable = params['seatsAvailable'];
      

      this.userID = localStorage.getItem('userId');

      this.apiservice.fetchBusSeats(params['busId']);

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
  


}
