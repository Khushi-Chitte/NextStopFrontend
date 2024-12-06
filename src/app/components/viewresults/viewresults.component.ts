// viewresults.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viewresults',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewresults.component.html',
  styleUrls: ['./viewresults.component.css'],
})
export class ViewresultsComponent implements OnInit {
  buses: any[] = []; 
  searchParams: any = {}; 

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log('Search Parameters:', params); 
      this.searchParams = params;

      
      this.fetchBuses();
    });
  }

  fetchBuses() {
    console.log('Mock API Call: Fetching buses...');
    console.log('Search Criteria:', this.searchParams); 

    const mockBuses = [
      {
        scheduleId: 4,
        busId: 1,
        busName: 'Volvo Express',
        routeId: 1,
        origin: this.searchParams.origin,
        destination: this.searchParams.destination,
        date: this.searchParams.travelDate,
        departureTime: '10:00 AM',
        arrivalTime: '2:00 PM',
        fare: 500,
        seatsAvailable: 10, 
      },
      {
        scheduleId: 4,
        busId: 1,
        busName: 'VRL Travels',
        origin: this.searchParams.origin,
        destination: this.searchParams.destination,
        date: this.searchParams.travelDate,
        departureTime: '11:00 AM',
        arrivalTime: '3:30 PM',
        fare: 600,
        seatsAvailable: 5, 
      },
    ];

    this.buses = mockBuses;
    console.log('Filtered Buses:', this.buses); 
  }

  onBook(bus: any) {
    console.log('Booking Bus:', bus); // Debug log
    // Navigate to the booking page with bus details
    this.router.navigate(['/app-book-bus'], { 
      queryParams: { 
        scheduleId: bus.scheduleId,
        busId: bus.busId,
        seatsAvailable: bus.seatsAvailable
      }
     });
  }
}
