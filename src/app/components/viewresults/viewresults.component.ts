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
  buses: any[] = []; // Array to store bus results
  searchParams: any = {}; // Stores the search criteria

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Retrieve query parameters from the route
    this.route.queryParams.subscribe((params) => {
      console.log('Search Parameters:', params); // Debug log
      this.searchParams = params;

      // Fetch buses based on search criteria
      this.fetchBuses();
    });
  }

  fetchBuses() {
    console.log('Mock API Call: Fetching buses...');
    console.log('Search Criteria:', this.searchParams); // Debug log

    const mockBuses = [
      {
        id: 1,
        name: 'Morning Star Travels',
        from: this.searchParams.from,
        to: this.searchParams.to,
        departureTime: '10:00 AM',
        arrivalTime: '2:00 PM',
        price: 500,
        seatsAvailable: 10, // Added seat availability
      },
      {
        id: 2,
        name: 'VRL Travels',
        from: this.searchParams.from,
        to: this.searchParams.to,
        departureTime: '11:00 AM',
        arrivalTime: '3:30 PM',
        price: 600,
        seatsAvailable: 5, // Added seat availability
      },
    ];

    // Filter buses based on the search criteria
    this.buses = mockBuses.filter(
      (bus) =>
        bus.from.toLowerCase() === this.searchParams.from.toLowerCase() &&
        bus.to.toLowerCase() === this.searchParams.to.toLowerCase()
    );
    console.log('Filtered Buses:', this.buses); // Debug log
  }

  onBook(bus: any) {
    console.log('Booking Bus:', bus); // Debug log
    // Navigate to the booking page with bus details
    this.router.navigate(['/app-book-bus'], { queryParams: { busId: bus.id } });
  }
}
