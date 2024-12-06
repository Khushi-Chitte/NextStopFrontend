import { Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-bus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-bus.component.html',
  styleUrl: './book-bus.component.css'
})
export class BookBusComponent implements OnInit{
  busId: any;
  scheduleId: any;
  seatsAvailable: any;
  userID: any;
  
  constructor(private route: ActivatedRoute, private apiservice: ApiServiceService) {
    this.seats = this.apiservice.allBusSeats;
  }

  seats: Signal<any[]>;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log('bus book params: ', params);
      this.busId = params['busId'];
      this.scheduleId = params['scheduleId'];
      this.seatsAvailable = params['seatsAvailable'];
      
      const storedUser = JSON.parse(localStorage.getItem('userDetails') || '{}');

      this.userID = storedUser.userID;

      this.apiservice.fetchBusSeats(params['busId']);

    });
  }

}
