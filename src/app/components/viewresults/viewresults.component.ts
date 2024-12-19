import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthserviceService } from '../../services/authservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viewresults',
  standalone: true,
  imports: [CommonModule, SearchComponent],
  templateUrl: './viewresults.component.html',
  styleUrls: ['./viewresults.component.css'],
})
export class ViewresultsComponent implements OnInit, OnDestroy {
  buses: any[] = []; 
  busTypes: string[] = ['Sleeper', 'AC', 'NonAC', 'SleeperAC', 'Seater'];
  filteredBuses: any[] = [];
  selectedBusTypes: string[] = [];
  searchParams: any = {
    Origin: '',
    Destination: '',
    TravelDate: ''
  }; 

  isAuthenticated: boolean = false;
  showFilters: boolean = false;
  showSortOptions: boolean = false;
  private authStatusSubscription!: Subscription;
  private queryParamsSubscription!: Subscription;
  loading: boolean = true;
  isPassenger: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private apiS: ApiServiceService, private authS: AuthserviceService ) {}

  ngOnInit() {
    this.isPassenger = this.authS.getUserRoles() === 'passenger';
    
    this.queryParamsSubscription = this.route.queryParams.subscribe((params) => {
      this.searchParams = { ...params };
      this.fetchBusSearchResults(params['Origin'], params['Destination'], params['TravelDate']);
    });

    this.authStatusSubscription = this.authS.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  fetchBusSearchResults(Origin: string, Destination: string, TravelDate: string) {
    this.loading = true;
    this.apiS.fetchBusSearchResults(Origin, Destination, TravelDate).subscribe({
      next: (response: any) => {
        this.buses = response || [];
        this.filteredBuses = [...this.buses]; // Initialize filteredBuses with all buses
        this.buses.forEach(bus => this.fetchBusDetailsById(bus.busId));
      },
      error: (error: any) => console.error('Error in fetching search results', error),
      complete: () => this.loading = false,
    });
  }

  onBusTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedBusTypes.push(target.value);
    } else {
      this.selectedBusTypes = this.selectedBusTypes.filter(type => type !== target.value);
    }
    this.filterBuses();
  }

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const sortOption = target.value;
    
    if (sortOption === 'priceAsc') {
      this.filteredBuses.sort((a, b) => a.fare - b.fare);
    } else if (sortOption === 'priceDesc') {
      this.filteredBuses.sort((a, b) => b.fare - a.fare);
    } else if (sortOption === 'rating') {
      this.filteredBuses.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }
  }

  resetFilters() {
    this.showFilters = false;
    this.showSortOptions = false;
    this.selectedBusTypes = [];
    this.filteredBuses = [...this.buses];
  }

  filterBuses() {
    if (this.selectedBusTypes.length === 0) {
      this.filteredBuses = [...this.buses];
    } else {
      this.filteredBuses = this.buses.filter(bus => this.selectedBusTypes.includes(bus.busType));
    }
  }

  fetchBusDetailsById(busId: any) {
    this.apiS.fetchBusDetailsById(busId).subscribe({
      next: (busDetails: any) => {
        console.log('Bus Details:', busDetails);
        const bus = this.buses.find(b => b.busId === busId);
        if (bus) {
          bus.busType = busDetails.busType; 
        }

        this.fetchBusRatings(busId);
      },
      error: (error: any) => {
        console.error('Error fetching bus details: ', error);
      }
    });
  }

  fetchBusRatings(busId: any) {
    this.apiS.getFeedbacksByBusId(busId).subscribe({
      next: (feedbacks: any[]) => {
        const bus = this.buses.find(b => b.busId === busId);
        if (bus && feedbacks && feedbacks.length > 0) {
          const averageRating = this.calculateAverageRating(feedbacks);
          bus.averageRating = averageRating;
        } else {
          bus.averageRating = 'No ratings yet'; 
        }
      },
      error: (error: any) => {
        console.error('Error fetching feedbacks: ', error);
      }
    });
  }

  calculateAverageRating(feedbacks: any[]): number {
    const totalRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const averageRating = totalRating / feedbacks.length;
    return parseFloat(averageRating.toFixed(2));
  }

  onView(bus: any) {
    if(this.isAuthenticated) {
      console.log('Booking Bus:', bus); // Debug log
      // Navigate to the booking page with bus details
      this.router.navigate(['/app-book-bus'], { 
        queryParams: { 
          scheduleId: bus.scheduleId,
          busId: bus.busId,
          seatsAvailable: bus.availableSeats,
          rating: bus.averageRating ? (bus.averageRating + ' ⭐') : 'No ratings yet' 
        }
     });
    }

    else {
      alert("Please login first to book.");
    }
    
  }
}
